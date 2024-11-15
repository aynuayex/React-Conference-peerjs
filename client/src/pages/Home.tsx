import CreateRoom from "../components/CreateRoom";

const Home = () => {
  return (
    <div className="relative flex flex-col justify-center items-center h-screen w-screen">
      <div className="absolute top-0 left-0 w-full flex flex-col justify-center items-center py-3 bg-blue-300">
        <div className="flex justify-center items-center py-3 gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>
            Video chat may not work, due to{" "}
            <a
              href="https://community.render.com/t/socket-io-in-a-node-app/3051/2"
              target="_blank"
              rel="noopener noreferrer external"
              className="underline hover:decoration-1 active:decoration-slate-400"
            >
              renders
            </a>{" "}
            free tier plan host limiting or stopping the backend after 15
            Minutes of inactivity.
          </span>
        </div>
        <div>
          For more info contact me{" "}
          <a
            href="https://ayne-abreham-portfolio-website.vercel.app/#contact"
            target="_blank"
            rel="noopener noreferrer external"
            className="underline hover:decoration-1 active:decoration-slate-400"
          >
            here.
          </a>
        </div>
      </div>
      <CreateRoom />
    </div>
  );
};

export default Home;
