"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const checkMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
        navigator.userAgent
      );
      setIsMobile(checkMobile);
    }
  }, []);
  return isMobile;
}

export default function Chat() {
  const isMobile = useIsMobile();
  const [activeChat, setActiveChat] = useState<{
    id: string;
    type: "general" | "private";
    name?: string;
    photo?: string;
  } | null>(() => {
    const saved = localStorage.getItem("activeChat");
    return saved ? JSON.parse(saved) : { id: "general", type: "general" };
  });
  useEffect(() => {
    if (activeChat) {
      localStorage.setItem("activeChat", JSON.stringify(activeChat));
    }
  }, [activeChat]);

  if (!isMobile) {
    return (
      <>
        <div className="page h-full w-full grid grid-cols-5 grid-rows-10">
          <div className=" search col-start-1 row-start-1 border-1 border-[#33A1E040] flex items-center justify-center">
            <div className="search_bar w-[90%] h-[75%] flex items-center justify-center border-1 border-[rgba(255,255,255,0.3)] rounded-[60px] bg-[#FFFFFF30] font-sans shadow-[0_0_15px_#33A1E0]">
              <div className="loop w-[12%] h-[80%] bg-no-repeat bg-contain bg-center bg-[url('/loop.svg')] ml-2 "></div>
              <input
                type="text"
                placeholder="Search"
                className="w-full h-full border-0 bg-transparent text-[#FFFFFF60] text-[13px] sm:text-[16px] lg:text-lg p-2 focus:outline-none"
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
                <p className="text-[#33A1E0] text-[11px] sm:text-[16px] lg:text-xl font-bold p-1 ml-2">
                  # général
                </p>
              </div>
              <div
                className="friend1 w-full h-[10%] border-1 border-[#33A1E040] border-t-0 border-r-0 cursor-pointer flex items-center"
                onClick={() =>
                  setActiveChat({ id: "friend1", type: "private" })
                }
              >
                <div className="profile w-[20%] h-[80%] bg-center bg-no-repeat bg-[url('/profile.svg')] bg-contain ml-1"></div>
                <p className="text-[#33A1E0] text-[13px] sm:text-[16px] lg:text-lg p-1 flex justify-center items-center">
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
                <p className="text-[#33A1E0] text-[13px] sm:text-[16px] lg:text-lg p-1 flex items-center justify-start">
                  Name
                </p>
              </div>
            </div>

            <div className="parameters w-full h-[10%] border-1 border-[#33A1E040] flex flex-end items-center justify-center ">
              <div className="profile w-[28%] h-[90%] bg-center bg-contain bg-no-repeat bg-[url('/profile.svg')]"></div>
              <p className="name text-[#FFFFFF] text-[11px] mt-2 sm:text-[16px] lg:text-lg p-1 w-[80%] h-full flex items-center justify-start">
                MEEEE
              </p>
              <Link
                href="/login"
                className="prameter w-[25%] h-[75%] bg-center bg-contain bg-no-repeat bg-[url('/parametre.svg')] cursor-pointer flex justify-end items-center mr-2"
              ></Link>
            </div>
          </div>
          {activeChat?.type === "general" ? (
            <div className="bar col-span-4 col-start-2 row-start-1 border-1 border-[#33A1E040] border-l-0 bg-transparent flex flex-row items-center justify-between">
              <h1 className="h-full flex flex-end justify-center items-center text-lg sm:text-4xl font-sans text-[#33A1E0] [text-shadow:_0_2px_4px_#33A1E0] [--tw-text-stroke:1px_#154D71] [text-stroke:var(--tw-text-stroke)] ml-2">
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
              <h1 className="h-full flex flex-end justify-end items-center text-4xl font-sans text-[#33A1E0] [text-shadow:_0_2px_4px_#33A1E0] [--tw-text-stroke:1px_#154D71] [text-stroke:var(--tw-text-stroke)] flex-grow mr-2">
                TalkaNova
              </h1>
            </div>
          )}

          <div className="chat  flex flex-col bg-transparent col-span-4 row-span-9 col-start-2 row-start-2">
            <div className="msgs h-full w-full"></div>

            <div className="send_part w-full h-[10%] flex items-center justify-center font-sans">
              <div className="send_bar h-[94%] w-[99%] flex items-center justify-center border-1 border-[rgba(255,255,255,0.3)] rounded-[60px] bg-[rgba(255,255,255,0.06)] shadow-[0_0_15px_#33A1E0]">
                <button className="add_file lg:w-9.5 lg:h-9 sm:w-7 sm:h-6 w-4.5 h-4 bg-[#33A1E0] cursor-pointer border-0 rounded-[100%] flex justify-center items-center ml-1 sm:ml-2">
                  <div className="add w-[75%] h-[70%] bg-center bg-contain bg-no-repeat bg-[url('/add.svg')]"></div>
                </button>
                <input
                  type="text"
                  placeholder="Send message ..."
                  required
                  className="w-full h-full text-[13px] sm:text-[16px] lg:text-lg flex items-center justify-center border-0 bg-transparent text-[#FFFFFF] focus:outline-nonen ml-2 focus:outline-none"
                />
                <button className="send w-[5%] h-[80%] bg-center bg-contain bg-no-repeat bg-[url('/send.svg')] mr-2"></button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
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
                <p className="name text-[#FFFFFF] mt-2 text-2xl p-1 w-[80%] h-full flex items-center justify-start">
                  MEEEE
                </p>
                <Link
                  href="/login"
                  className="prameter w-[12%] h-[60%] bg-center bg-contain bg-no-repeat bg-[url('/parametre.svg')] cursor-pointer flex justify-end items-center mr-2"
                ></Link>
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
                    className="w-full h-full text-lg flex items-center justify-center border-0 bg-transparent text-[#FFFFFF] focus:outline-nonen ml-2 focus:outline-none"
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
}
// {activeChat}
