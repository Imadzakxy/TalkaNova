"use client";
import Link from "next/link";
import client from "../config/supabsaeClient";
import { useState } from "react";

export default function SignUp() {
  // const SignUp = async () => {
  //   let { user, error } = await client.auth.signUp({
  //     email: stat.email,
  //     password: stat.password,
  //   });
  // };

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  return (
    <>
      <h1 className="h-25 flex justify-center items-center text-4xl font-[ZenDots] text-[#33A1E0] [text-shadow:_0_2px_4px_#33A1E0] [--tw-text-stroke:1px_#154D71] [text-stroke:var(--tw-text-stroke)]">
        TalkaNova
      </h1>
      {/* Form container */}
      <form
        className="box h-[53%] sm:h-[60%] lg:h-[70%] w-[80%] mx-auto flex flex-col items-center justify-center bg-[rgba(255,255,255,0.05)] backdrop-transparent border-1 border-[rgba(255,255,255,0.25)] shadow-[0_10px_27px_rgba(51,161,224,0.40)] text-[14px] lg:text-lg rounded-[20px] z-10 mt-15 sm:mt-3"
        style={{ maxWidth: "520px" }}
      >
        {/* Username field */}
        <div className="flex items-center justify-center  w-[80%] h-[9%] mt-4 border-1 border-[rgba(255,255,255,0.25)] rounded-[15px] bg-transparent font-sans shadow-[0_5px_10px_rgba(0,0,0,0.3)]">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full h-full border-0 bg-transparent text-[#ffffff] p-5 focus:outline-none"
          />
          <div className="user w-[12%] h-[75%] bg-center bg-contain bg-no-repeat bg-[url('/user.svg')] mr-2 sm:mr-0"></div>
        </div>

        {/* Email field */}
        <div className="flex items-center justify-center w-[80%] h-[9%] mt-4 border-1 border-[rgba(255,255,255,0.25)] rounded-[15px] bg-transparent font-sans shadow-[0_5px_10px_rgba(0,0,0,0.3)]">
          <input
            type="text"
            placeholder="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-full bg-transparent border-0 text-[#ffffff] p-5 focus:outline-none"
          />
          <div className="mail w-[12%] h-[75%] bg-center bg-contain bg-no-repeat bg-[url('/mail.svg')] mr-2 sm:mr-0"></div>
        </div>

        {/* Password field */}
        <div className="flex items-center justify-center w-[80%] h-[9%] mt-4 border-1 border-[rgba(255,255,255,0.25)] rounded-[15px] bg-transparent font-sans shadow-[0_5px_10px_rgba(0,0,0,0.3)]">
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-full bg-transparent border-0 text-[#ffffff] p-5 focus:outline-none"
          />
          <div className="lock w-[12%] h-[75%] bg-center bg-contain bg-no-repeat bg-[url('/lock.svg')] mr-2 sm:mr-0"></div>
        </div>

        {/* Confirm Password field */}
        <div className="flex items-center justify-center w-[80%] h-[9%] mt-4 border-1 border-[rgba(255,255,255,0.25)] rounded-[15px] bg-transparent font-sans shadow-[0_5px_10px_rgba(0,0,0,0.3)]">
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-full bg-transparent border-0 text-[#ffffff] p-5 focus:outline-none"
          />
          <div className="lock w-[12%] h-[75%] bg-center bg-contain bg-no-repeat bg-[url('/lock.svg')] mr-2 sm:mr-0"></div>
        </div>

        {/* Profile image upload */}
        <div className="input_img w-[80%] h-[35%] cursor-pointer border-2 border-dashed border-[rgba(255,255,255,0.25)] text-[#d0d0d0] rounded-[15px] flex items-center justify-center shadow-[0_5px_10px_rgba(0,0,0,0.3)] mt-4 ">
          <div className="add w-5 h-5 sm:w-8 sm:h-8  bg-contain bg-center bg-no-repeat bg-[url('/add.svg')] hover:text-[#33A1E0]"></div>
          {imagePreview && (
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 flex justify-center items-center h-8 w-8 rounded-full bg-black/50 text-white text-xl hover:bg-black/70"
            >
              &times;
            </button>
          )}

          {/* Icône Add au centre (visible seulement sans image) */}
          {!imagePreview && (
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center text-[#d0d0d0] hover:text-[#33A1E0] cursor-pointer"
            >
              <div className="add w-8 h-8 bg-center bg-contain bg-no-repeat bg-[url('/add.svg')]"></div>
              <span className="text-xs mt-2">Add Image</span>
            </label>
          )}

          <input
            type="file"
            id="image-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>

        {/* Sign up button */}
        <div className="flex items-center justify-center w-full h-[42%] sm:h-[18%] mt-4 ">
          <Link
            href="/chat"
            className="inline-block h-[38px] w-[40%] sm:h-[50px] sm:w-[60%] bg-none"
          >
            <button
              type="submit"
              // onClick={handleSubmit}
              className="bt_sign h-full w-full rounded-[15] bg-[#154D71] shadow-[0_2px_4px_rgba(51,161,224,0.65)] text-white font-semibold flex items-center justify-center  hover:bg-[#33A1E0] hover:text-[#154D71] hover:cursor-pointer transition duration-300"
            >
              Sign up
            </button>
          </Link>
        </div>

        {/* Link to Log in */}
        <div className="login w-full flex items-end justify-center text-[#d0d0d0] font-sans flex-grow">
          <span className="have p-2">
            You have an account?
            <Link href="/login">
              <button className="log_in text-[#33A1E0] font-bold cursor-pointer bg-transparent p-[7px] hover:[text-shadow:0_2px_4px_rgba(51,161,224)]">
                Log in!
              </button>
            </Link>
          </span>
        </div>
      </form>

      {/* Help/contact section */}
      <div className="w-full flex items-center justify-center fixed bottom-0 p-4 font-sans text-[#d0d0d0] z-10">
        <span className="flex items-center justify-center w-full text-center">
          If you have a problem,
          <Link href="/help" className="ml-2 text-[#33A1E0] hover:underline">
            contact us!
          </Link>
        </span>
      </div>
    </>
  );
}
