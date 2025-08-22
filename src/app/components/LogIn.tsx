import Link from "next/link";

export default function LogIn() {
  return (
    <>
      <h1 className="h-25 flex justify-center items-center text-4xl font-[ZenDots] text-[#33A1E0] [text-shadow:_0_2px_4px_#33A1E0] [--tw-text-stroke:1px_#154D71] [text-stroke:var(--tw-text-stroke)] ">
        TalkaNova
      </h1>
      <form
        className="box lg:h-[57%] sm:h-[50%] h-[38%] w-[85%]  shadow-[0_10px_27px_rgba(51,161,224,0.40)]  flex flex-col justify-start items-center border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.05)] border-[1px] rounded-[20px] text-[11px] lg:text-sm z-10 mx-auto  sm:mt-12 mt-29"
        style={{
          maxWidth: "520px",
          minWidth: "320px",
        }}
      >
        <div className="inputs h-[40%] w-full flex flex-col items-center justify-center">
          <div className="input_uname h-[30%] w-[85%] front-sans flex items-center justify-center border-1 border-[rgba(255,255,255,0.25)] rounded-[15px] bg-transparent shadow-[0_5px_10px_rgba(0,0,0,0.3)] mt-4">
            <input
              type="name"
              placeholder="Username or email"
              required
              className="w-full h-full flex items-center justify-center front-sans border-0 bg-transparent text-[#ffffff] p-5 focus:outline-none"
            />
            <div className="user w-[12%] h-[75%] bg-center bg-contain bg-no-repeat bg-[url('/user.svg')] mr-2 sm:mr-0"></div>
          </div>

          <div className="input_pass h-[30%] w-[85%] flex items-center justify-center border-1 border-[rgba(255,255,255,0.25)] rounded-[15px] bg-transparent shadow-[0_5px_10px_rgba(0,0,0,0.3)] mt-4">
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full h-full flex items-center justify-center border-0 bg-transparent text-[#ffffff] p-5 focus:outline-none"
            />
            <div className="lock w-[12%] h-[75%] bg-center bg-contain bg-no-repeat bg-[url('/lock.svg')] mr-2 sm:mr-0"></div>
          </div>
        </div>

        <div className="remember w-[90%] h-[10%] sm:h-[18%] flex items-center font-sans justify-between text-[12px] sm:text-[14.5px] p-5">
          <span className="rem flex items-center">
            <label className="relative flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="peer w-5 h-5 appearance-none border border-[rgba(255,255,255,0.25)] rounded bg-transparent"
              />
              <span className="absolute left-0 top-0 w-5 h-5 bg-[url('/check.png')] bg-contain bg-center bg-no-repeat opacity-0 peer-checked:opacity-100 pointer-events-none"></span>
            </label>

            <span className="ml-2 text-[#d0d0d0]">Remember me</span>
          </span>
          <Link href="/help">
            <button className="forgot text-[#33A1E0] cursor-pointer bg-transparent hover:[text-shadow:0_2px_4px_rgba(51,161,224,0.7)]">
              Forgot password!
            </button>
          </Link>
        </div>

        <div className="login h-[40%] sm:h-[27%] w-full flex items-center justify-center">
          <Link
            href="/chat"
            className=" h-[42px] w-[48%] sm:h-[50px] sm:w-[60%] bg-none"
          >
            <button
              type="submit"
              className="btn w-full h-full shadow-[0_2px_4px_rgba(51,161,224,0.65)] rounded-[15px] bg-[#154D71] text-white font-semibold flex items-center justify-center hover:bg-[#33A1E0] hover:text-[#154D71] cursor-pointer"
            >
              Log in
            </button>
          </Link>
        </div>

        <div className="register w-full flex items-end justify-center text-[#d0d0d0] font-sans flex-grow">
          <span className="creat p-[5px]">
            Don&apos;t have an account?
            <Link href="/signup">
              <button className="signup text-[#33A1E0] font-bold cursor-pointer bg-transparent p-[7px] hover:[text-shadow:0_2px_4px_rgba(51,161,224)]">
                Sign up!
              </button>
            </Link>
          </span>
        </div>
      </form>

      <div className="help w-full flex items-center justify-center font-sans text-[#d0d0d0] z-10 fixed bottom-0 p-4">
        <span className="contact flex items-center justify-center w-full text-center">
          If you need help,
          <Link
            href="/help"
            className="acc ml-2 hover:underline text-[#33A1E0] cursor-pointer"
          >
            contact us!
          </Link>
        </span>
      </div>
    </>
  );
}
