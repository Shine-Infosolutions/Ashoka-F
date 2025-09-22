import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { AiFillCloseCircle, AiOutlineMenu } from "react-icons/ai";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AddBooking from "./pages/Students/AddBooking";
import UpdateBooking from "./pages/Students/UpdateBooking";
import ListBooking from "./pages/Students/ListBooking";
import MenuView from "./pages/Students/MenuView";
import Invoice from "./pages/Students/Invoice";
import SharedInvoice from "./pages/Students/SharedInvoice";

import logo from "./assets/pcs.png";

const MOBILE_WIDTH = 1023;

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState("dashboard");
  const currentUser = localStorage.getItem("currentUser");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");
  const moduleAssigned = JSON.parse(localStorage.getItem("module"));
  const [ml, setML] = useState(false);

  // Sidebar toggle function
  const toggleSidebar = () => {
    if (window.innerWidth <= MOBILE_WIDTH) {
      setML((prev) => !prev);
    }
  };

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (window.innerWidth <= MOBILE_WIDTH) {
      setML(false);
    }
  }, [location.pathname]);

  // Close sidebar if resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_WIDTH) {
        setML(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser]);
  useEffect(() => {
    if (location.pathname == "") {
      setActiveLink("dashboard");
    }
  }, [location.pathname]);

  // Check if current route is shared invoice
  const isSharedInvoice = location.pathname.startsWith('/shared-invoice');
  
  // If it's shared invoice route, render only that component
  if (isSharedInvoice) {
    return (
      <Routes>
        <Route path="/shared-invoice/:id" element={<SharedInvoice />} />
      </Routes>
    );
  }

  return (
    <>
      {currentUser ? (
        <section className="bg-gray-100 dark:bg-gray-900">
          {/* Backdrop for mobile sidebar */}
          {ml && window.innerWidth <= MOBILE_WIDTH && (
            <div
              className="fixed inset-0 z-20 bg-black bg-opacity-40 transition-opacity lg:hidden"
              onClick={() => setML(false)}
            ></div>
          )}
          <aside
            className={
              ml
                ? "fixed top-0 z-30 ml-[0] flex h-screen w-full flex-col justify-between border-r bg-gray-800 px-6 pb-3 transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%] dark:bg-gray-700 dark:border-gray-800"
                : "fixed top-0 z-30 ml-[-100%] flex h-screen w-full flex-col justify-between border-r bg-gray-800 px-6 pb-3 transition duration-300 md:w-4/12 lg:ml-0 lg:w-[25%] xl:w-[20%] 2xl:w-[15%] dark:bg-gray-700 dark:border-gray-800"
            }
          >
            <div className=" overflow-y-auto z-60 h-[90vh] overflow-x-hidden">
              <div className="-mx-6 z-60 px-6 py-4">
                {window.innerWidth <= MOBILE_WIDTH && (
                  <div className="flex items-center justify-between">
                    <h5
                      onClick={toggleSidebar}
                      className="z-60 flex justify-end text-2xl font-medium text-[#c3ad6b] lg:block dark:text-[#c3ad6b]"
                    >
                      <AiFillCloseCircle />
                    </h5>
                    <button
                      onClick={handleLogout}
                      className="group flex items-center space-x-4 rounded-md px-4 py-5 text-[#c3ad6b]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#c3ad6b"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="group-hover:text-yellow-700 dark:group-hover:text-yellow-700">
                        Logout
                      </span>
                    </button>
                  </div>
                )}
                <h2 className="font-semibold text-xl mt-3 text-gold">
                  ASHOKA HOTEL
                </h2>
              </div>

              <div className="mt-8 text-center">
                <img
                  src={logo}
                  alt="admin"
                  className="m-auto h-[120px] w-[230px] rounded-md object-cover"
                />
                <h5 className="mt-4  text-xl font-semibold text-black lg:block dark:text-black">
                  {name}
                </h5>
                <span className=" text-gold lg:block">{role}</span>
             
              </div>

              <ul className="mt-3 space-y-2 tracking-wide">
                <li
                  onClick={() => {
                    setActiveLink("dashboard");
                    navigate("/");
                    if (window.innerWidth <= MOBILE_WIDTH) setML(false);
                  }}
                >
                  <a
                    href="#"
                    aria-label="dashboard"
                    className={
                      activeLink == "dashboard"
                        ? "relative flex items-center space-x-4 rounded-xl bg-gold px-1 py-2 text-black font-bold"
                        : "relative flex items-center space-x-4 rounded-xl px-1 py-2 text-[#c3ad6b]"
                    }
                  >
                    <svg
                      className="-ml-1 h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                        className="fill-current text-black"
                      ></path>
                      <path
                        d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                        className="fill-current text-black/60 group-hover:text-yellow-700"
                      ></path>
                      <path
                        d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                        className="fill-current group-hover:text-yellow-700"
                      ></path>
                    </svg>
                    <span className="-mr-1 font-medium">Dashboard</span>
                  </a>
                </li>
              </ul>
              <ul className="mt-3 space-y-2 tracking-wide">
                 <li
      onClick={() => {
        setActiveLink("Booking");
        navigate("/list-booking");
        if (window.innerWidth <= MOBILE_WIDTH) setML(false);
      }}
    >
      <a
        href="#"
        aria-label=""
        className={
          activeLink === "Booking"
                        ? "relative flex items-center space-x-4 rounded-xl bg-gold px-1 py-2 text-black font-bold"
                        : "relative flex items-center space-x-4 rounded-xl px-1 py-2 text-[#c3ad6b]"
                    }
                  >
                    <svg
                      className="-ml-1 h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                        className="fill-current text-black"
                      ></path>
                      <path
                        d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                        className="fill-current text-black/60 group-hover:text-yellow-700"
                      ></path>
                      <path
                        d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                        className="fill-current group-hover:text-yellow-700"
                      ></path>
                    </svg>
                    <span className="-mr-1 font-medium">Booking</span>
                  </a>
                </li>
              </ul>
               {/* <ul className="mt-8 space-y-2 tracking-wide">
                <li
                  onClick={() => {
                    setActiveLink("dashboard");
                    navigate("/meal-plan-editor");
                    setMl();
                  }}
                >
                  <a
                    href="#"
                    aria-label="dashboard"
                    className={
                      activeLink == "dashboard"
                        ? "relative flex items-center space-x-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-1 py-2 text-white "
                        : "relative flex items-center space-x-4 rounded-xl px-1 py-2  text-gray-600"
                    }
                  >
                    <svg
                      className="-ml-1 h-6 w-6"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8ZM6 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-1Z"
                        className="dark:fill-slate-600 fill-current text-cyan-400"
                      ></path>
                      <path
                        d="M13 8a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8Z"
                        className="fill-current text-cyan-200 group-hover:text-cyan-300"
                      ></path>
                      <path
                        d="M13 15a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1Z"
                        className="fill-current group-hover:text-sky-300"
                      ></path>
                    </svg>
                    <span className="-mr-1 font-medium">No limit</span>
                  </a>
                </li>
              </ul> */}
            </div>

            <div className="-mx-6 md:flex hidden items-center justify-between border-t px-6 pt-4 dark:border-gold">
              <button
                onClick={handleLogout}
                className="group flex items-center space-x-4 rounded-md px-4 py-3 text-gold dark:text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="group-hover:text-yellow-700 dark:group-hover:text-yellow-700">
                  Logout
                </span>
              </button>
            </div>
          </aside>
          <div className="ml-auto mb-6 lg:w-[75%] xl:w-[80%] 2xl:w-[85%]">
            <div
              className={
                window.innerWidth < 768
                  ? " sticky md:z-50 top-0 h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700 lg:py-2.5"
                  : "sticky  md:z-50 top-0 h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700 lg:py-2.5"
              }
            >
              <div className="flex items-center justify-between space-x-4 px-4 2xl:container h-full">
                <h5
                  hidden
                  className="text-2xl font-medium text-gray-600 lg:block dark:text-white"
                >
                  {activeLink.toLocaleUpperCase()}
                </h5>
                <h5
                  onClick={toggleSidebar}
                  className="text-2xl lg:hidden font-medium text-gray-600  dark:text-white"
                >
                  <AiOutlineMenu />
                </h5>
                <div className="flex space-x-4"></div>
              </div>
            </div>

            <div className="px-6 pt-6 bg-white">
              <Routes>
                <Route path="/" element={<Home />} />
                   <Route path="/add-booking" element={<AddBooking />} />
                   <Route path="/list-booking" element={<ListBooking />} />
                   <Route path="/update-booking/:id" element={<UpdateBooking />} />
                   <Route path="/menu-view/:bookingRef" element={<MenuView />} />
                   <Route path="/invoice/:id" element={<Invoice />} />
           
              </Routes>
            </div>
          </div>
        </section>
      ) : (
        <>
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default App;
