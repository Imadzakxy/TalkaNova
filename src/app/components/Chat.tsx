"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import client from "../config/supabsaeClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

function useIsPc() {
  const [isPc, setIsPc] = useState(false);
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const checkMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
        navigator.userAgent
      );
      setIsPc(!checkMobile);
    }
  }, []);
  return isPc;
}

export default function Chat() {
  const isPc = useIsPc();
  const [session, setSession] = useState([]);
  const [profile, setProfile] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [usersOnline, setUsersOnline] = useState([]);
  const router = useRouter();

  const [activeChat, setActiveChat] = useState<{
    id: string;
    type: "general" | "private";
    name?: string;
    photo?: string;
  } | null>(() => {
    return { id: "general", type: "general" };
  });
  
  useEffect(() => {
    const getSessionAndProfile = async () => {
      // Récupérer la session actuelle
      const { data: { session } } = await client.auth.getSession();
      setSession(session);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        router.push("/");
      }
    };

    getSessionAndProfile();

    // Écouter les changements d'état de connexion
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const fetchProfile = async (userId: string) => {
    const { data, error } = await client
      .from("profile")
      .select("*") // récupère tout: id, user_name, pfp_url, email
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Erreur fetch profile:", error.message);
      setProfile(null);
    } else {
      setProfile(data);
    }
  };

  const handleLogout = async () => {
    const { error } = await client.auth.signOut();
    if (error) {
      console.error("Erreur logout:", error.message);
    } else {
      setProfile(null);
      setSession(null);
      router.push("/");
    }
  };
  
  const roomRef = useRef<any>(null);

  useEffect(()=>{
    if(!session?.user){
      setUsersOnline([]);
      return;
    }
    
    if (roomRef.current && typeof roomRef.current === "object" && "on" in roomRef.current) {
      try {
        client.removeChannel(roomRef.current);
      }catch (err) {
        console.error("Erreur removeChannel:", err);
      }
      roomRef.current = null;
    }

    const roomOne = client.channel("room_one", {
      config:{
        presence:{
          key: session?.user?.id,
        },
      },
    });

    roomRef.current = roomOne; 
    
    roomOne.on("broadcast", {event:"message"}, (payload) =>{
      console.log("📩 Message reçu de Supabase:", payload);
      setMessages((prevMessages)=>[...prevMessages, payload.payload]);
    });

    roomOne.subscribe(async (status)=>{
      if(status === "SUBSCRIBED"){
        await roomOne.track({ id:session?.user?.id, }); 
      } 
    });

    roomOne.on("presence", {event: "sync"}, () => {
      const state = roomOne.presenceState();
      setUsersOnline(Object.keys(state));
    });
    
    return () => {
      try {
      if (roomRef.current) {
        client.realtime.disconnect(); 
        roomRef.current.unsubscribe();
        client.removeChannel(roomRef.current);
        roomRef.current = null;
      }
      if (client.realtime && client.realtime.socket) {
        client.realtime.socket.disconnect();
        client.realtime.socket = null; // optionnel, mais safe
      }
      } catch (err) {
        console.error("Erreur cleanup websocket:", err);
      }
    };
  },[session]);

  const sendMessage = async (e)=>{
    e.preventDefault();
    if (!roomRef.current) return;

    await roomRef.current.send({
      type:"broadcast",
      event:"message",
      payload:{
        message: newMessage,
        user_name:profile?.user_name,
        avatar:profile?.pfp_url,
        timestamp: new Date().toISOString(),
      },
    });
    setNewMessage("");
  }; 

  if(session){
    /*if(!isPc){
      return (
      <>
        <div className="h-screen">
          {activeChat === null && (
            <div className="contact w-full h-full flex flex-col">
              <div className="bar h-[7%] w-full bg-transparent flex flex-row items-center justify-between">
                <h1 className="h-full flex flex-end justify-center items-center text-4xl font-sans text-[#33A1E0] [text-shadow:_0_2px_4px_#33A1E0] [--tw-text-stroke:1px_#154D71] [text-stroke:var(--tw-text-stroke)] ml-2">
                  TalkaNova
                </h1>
                <button className="profile w-[12%] h-[75%] bg-no-repeat bg-[url('/profile.svg')] bg-center bg-contain cursor-pointer flex justify-end items-center mr-2"></button>
              </div>

              <div className=" search h-[8%] w-full flex items-center justify-center">
                <div className="search_bar w-[90%] h-[78%] flex items-center justify-center border-1 border-[rgba(255,255,255,0.3)] rounded-[60px] bg-[#FFFFFF30] font-sans shadow-[0_0_15px_#33A1E0]">
                  <div className="loop w-[10%] h-[65%] bg-no-repeat bg-contain bg-center bg-[url('/loop.svg')] ml-3 "></div>
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full h-full border-0 bg-transparent text-[#FFFFFF60] text-[16px] lg:text-lg p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="massage h-full w-full flex flex-col font-sans border-1 border-[#33A1E040] bg-transparent">
                <div className="all_chats h-full w-full flex flex-col flex-grow">
                  <div
                    className="general w-full h-[10%] border-b-1 border-[#33A1E040] flex items-center "
                    onClick={() =>
                      setActiveChat({ id: "general", type: "general" })
                    }
                  >
                    <p className="text-[#33A1E0] text-xl font-bold p-1 ml-2">
                      # général
                    </p>
                  </div>
                  <div
                    className="friend1 w-full h-[10%] border-b-1 border-[#33A1E040] flex items-center"
                    onClick={() =>
                      setActiveChat({ id: "friend1", type: "private" })
                    }
                  >
                    <div className="profile w-[16%] h-[70%] bg-center bg-no-repeat bg-[url('/profile.svg')] bg-contain"></div>
                    <p className="text-[#33A1E0] text-xl p-1 flex justify-center items-center">
                      Friend1
                    </p>
                  </div>
                  <div
                    className="friend2 w-full h-[10%] border-b-1 border-[#33A1E040] flex items-center"
                    onClick={() =>
                      setActiveChat({ id: "friend2", type: "private" })
                    }
                  >
                    <div className="profile w-[16%] h-[70%] bg-center bg-no-repeat bg-[url('/profile.svg')] bg-contain"></div>
                    <p className="text-[#33A1E0] text-xl p-1 flex items-center justify-start">
                      Friend2
                    </p>
                  </div>
                </div>

                <div className="parameters w-full h-[10%] border-t-1 border-[#33A1E040] flex flex-end items-center justify-center ">
                  <div className="profile w-[20%] h-[80%] bg-center bg-contain bg-no-repeat bg-[url('/profile.svg')]"></div>
                  <p className="name text-[#FFFFFF] mt-2 text-2xl w-[80%] h-[80%] flex items-center justify-start">
                    MEEEE
                  </p>
                  <button
                    onClick={handleLogout}
                    className="prameter w-[12%] h-[60%] bg-center bg-contain bg-no-repeat bg-[url('/parametre.svg')] cursor-pointer flex justify-end items-center mr-2"
                  ></button>
                </div>
              </div>
            </div>
          )}

          {activeChat !== null && (
            <div className="chat w-full h-full flex flex-col">
              {activeChat.type === "general" ? (
                <div className="bar h-[7%] w-full border-1 border-[#33A1E040] bg-transparent flex flex-row items-center">
                  <div
                    className="back w-[10%] h-[60%] bg-center bg-contain bg-no-repeat bg-[url('/back.svg')] cursor-pointer flex justify-end items-center"
                    onClick={() => setActiveChat(null)}
                  ></div>
                  <h1 className="h-full flex flex-end items-center text-4xl font-sans text-[#33A1E0] [text-shadow:_0_2px_4px_#33A1E0] [--tw-text-stroke:1px_#154D71] [text-stroke:var(--tw-text-stroke)] flex-grow mr-2">
                    TalkaNova
                  </h1>
                  <button className="members w-[12%] h-[75%] bg-no-repeat bg-[url('/members.svg')] bg-center bg-contain cursor-pointer flex justify-end items-center mr-2"></button>
                </div>
              ) : (
                <div className="bar h-[7%] w-full border-1 border-[#33A1E040] bg-transparent flex flex-row items-center">
                  <div
                    className="back w-[10%] h-[60%] bg-center bg-contain bg-no-repeat bg-[url('/back.svg')] cursor-pointer flex justify-end items-center"
                    onClick={() => setActiveChat(null)}
                  ></div>
                  <div className="profile w-[12%] h-[70%] bg-center bg-no-repeat bg-[url('/profile.svg')] bg-contain"></div>
                  <p className="text-[#33A1E0] text-xl p-1 flex items-center justify-start">
                    {activeChat.id}
                  </p>
                  <h1 className="h-full flex flex-end justify-end items-center text-4xl font-sans text-[#33A1E0] [text-shadow:_0_2px_4px_#33A1E0] [--tw-text-stroke:1px_#154D71] [text-stroke:var(--tw-text-stroke)] flex-grow mr-2">
                    TalkaNova
                  </h1>
                </div>
              )}

              <div className="chat h-full w-full flex flex-col bg-transparent">
                <div className="msgs h-full w-full"></div>

                <div className="send_part w-full h-[10%] flex items-center justify-center font-sans">
                  <div className="send_bar h-[92%] w-[99%] flex items-center justify-center border-1 border-[rgba(255,255,255,0.3)] rounded-[60px] bg-[rgba(255,255,255,0.06)] shadow-[0_0_15px_#33A1E0]">
                    <button className="add_file w-[14%] h-[65%] bg-[#33A1E0] cursor-pointer border-0 rounded-[100%] flex justify-center items-center ml-3">
                      <div className="add w-[76%] h-[70%] bg-center bg-contain bg-no-repeat bg-[url('/add.svg')] rounded-[100%]"></div>
                    </button>
                    <input
                      type="text"
                      placeholder="Send message ..."
                        required
                        className="w-full h-full text-lg flex items-center justify-center border-0 bg-transparent text-[#FFFFFF] focus:outline-none ml-2 focus:outline-none"
                      />
                      <button className="send w-[12%] h-[80%] bg-center bg-contain bg-no-repeat bg-[url('/send.svg')] mr-2"></button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      );
    }*/
    return (
      <>
        <div className="page h-full w-full grid grid-cols-5 grid-rows-10">
          <div className=" search col-start-1 row-start-1 border-1 border-[#33A1E040] flex items-center justify-center">
            <div className="search_bar w-[90%] h-[75%] flex items-center justify-center border-1 border-[rgba(255,255,255,0.3)] rounded-[60px] bg-[#FFFFFF30] font-sans shadow-[0_0_15px_#33A1E0]">
              <div className="loop w-[13%] h-[70%] bg-no-repeat bg-contain bg-center bg-[url('/loop.svg')] ml-3"></div>
              <input
                type="text"
                placeholder="Search"
                className="w-full h-full border-0 bg-transparent text-[#FFFFFF60] text-[16px] sm:text-[25px] lg:text-3xl p-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="massage flex flex-col font-sans border-1 border-[#33A1E040] border-t-0 bg-transparent row-span-9 col-start-1 row-start-2">
            <div className="all_chats h-full w-full flex flex-col flex-grow">
              <div
                className="general w-full h-[10%] border-1 border-[#33A1E040] border-t-0 border-r-0 cursor-pointer flex items-center "
                onClick={() =>
                  setActiveChat({ id: "general", type: "general" })
                }
              >
                <p className="text-[#33A1E0] text-[11px] sm:text-xl lg:text-3xl font-bold p-1 ml-2">
                  # général
                </p>
              </div>
              <div
                className="friend1 w-full h-[10%] border-b-1 border-[#33A1E040] cursor-pointer flex items-center"
                onClick={() =>
                  setActiveChat({ id: "friend1", type: "private" })
                }
              >
                <div className="profile w-[20%] h-[80%] bg-center bg-no-repeat bg-[url('/profile.svg')] bg-contain ml-1"></div>
                <p className="text-[#33A1E0] text-[13px] sm:text-xl lg:text-3xl p-1 flex justify-center items-center">
                  Name
                </p>
              </div>
              <div
                className="friend2 w-full h-[10%] border-1 border-[#33A1E040] border-t-0 border-r-0 cursor-pointer flex items-center"
                onClick={() =>
                  setActiveChat({ id: "friend2", type: "private" })
                }
              >
                <div className="profile w-[20%] h-[80%] bg-center bg-no-repeat bg-[url('/profile.svg')] bg-contain ml-1"></div>
                <p className="text-[#33A1E0] text-[13px] sm:text-xl lg:text-3xl p-1 flex items-center justify-start">
                  Name
                </p>
              </div>
            </div>

            <div className="parameters w-full h-[10%] border-1 border-[#33A1E040] flex flex-end items-center justify-center ">
              <div 
                className="profile w-[28%] h-[90%] bg-center bg-cover bg-no-repeat rounded-full" 
                style={{ backgroundImage: `url(${profile?.pfp_url || '/profile.svg'})` }}
              ></div>
              <div className="infos h-[90%] w-[80%] flex flex-end flex-col p-1">
                <p className="name text-[#33A1E0] text-[7px] sm:text-xs lg:text-sm w-full h-[40%]">
                  {profile?.user_name}
                </p>
                <p className="email text-[#2678A3] text-[5px] sm:text-[10px] lg:text-xs w-full h-[40%] pt-1">
                  {profile?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="prameter w-[25%] h-[75%] bg-center bg-contain bg-no-repeat bg-[url('/parametre.svg')] cursor-pointer flex justify-end items-center mr-2"
              ></button>
            </div>
          </div>
          {activeChat?.type === "general" ? (
            <div className="bar col-span-4 col-start-2 row-start-1 border-1 border-[#33A1E040] border-l-0 bg-transparent flex flex-row items-center justify-between">
              <h1 className="h-full flex flex-end justify-center items-center text-2xl sm:text-4xl lg:text-5xl font-sans text-[#33A1E0] [text-shadow:_0_2px_4px_#33A1E0] [--tw-text-stroke:1px_#154D71] [text-stroke:var(--tw-text-stroke)] ml-2">
                TalkaNova
              </h1>
              <button className="members w-[5%] h-[75%] bg-no-repeat bg-[url('/members.svg')] bg-center bg-contain cursor-pointer flex justify-end items-center mr-2"></button>
            </div>
          ) : (
          <div className="bar col-span-4 col-start-2 row-start-1  border-1 border-[#33A1E040] border-l-0 bg-transparent flex flex-row items-center">
            <div className="profile w-[6%] h-[70%] bg-center bg-no-repeat bg-[url('/profile.svg')] bg-contain"></div>
            <p className="text-[#33A1E0] text-2xl p-1 flex items-center justify-start">
              {activeChat?.id}
            </p>
            <h1 className="h-full flex flex-end justify-end items-center text-xl sm:text-4xl lg:text-5xl  font-sans text-[#33A1E0] [text-shadow:_0_2px_4px_#33A1E0] [--tw-text-stroke:1px_#154D71] [text-stroke:var(--tw-text-stroke)] flex-grow mr-2">
              TalkaNova
            </h1>
          </div>
          )}

          <div className="chat  flex flex-col bg-transparent col-span-4 row-span-9 col-start-2 row-start-2">

            <div className="msgs p-2 flex flex-col overflow-y-auto w-full h-full">
              {messages.map((msg, idx)=>{
                console.log(msg.message);
                return <p key={idx}>{msg.message}</p>
              })}
            </div>
            
            <div className="send_part w-full h-[10%] flex items-center justify-center font-sans">
              <div className="send_bar h-[94%] w-[99%] flex items-center justify-center border-1 border-[rgba(255,255,255,0.3)] rounded-[60px] bg-[rgba(255,255,255,0.06)] shadow-[0_0_15px_#33A1E0] p-2">
                <button className="add_file w-[15px] h-[15px] sm:w-[25px] sm:h-[25px] lg:w-[36px] lg:h-[35px] bg-[#33A1E0] cursor-pointer border-0 rounded-[100%] flex justify-center items-center">
                  <div className="add w-[75%] h-[70%] bg-contain bg-center bg-no-repeat bg-[url('/add.svg')]"></div>
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send message ..."
                  required
                  className="w-full h-full text-[13px] sm:text-lg lg:text-2xl flex items-center justify-center border-0 bg-transparent text-[#FFFFFF] focus:outline-none ml-1 sm:ml-2 lg:ml-3 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="send w-[5%] h-full bg-center bg-contain bg-no-repeat bg-[url('/send.svg')]"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
