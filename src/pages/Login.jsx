import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

const Login = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Hardcoded credentials with roles
  const hardcodedUsers = {
    "Hotelashoka@gmail.com": {
      password: "Ashoka@001",
      role: "Admin",
      name: "Admin User",
      isActive: true,
  
    },
    "Staffashoka@gmail.com": {
      password: "staff@002",
      role: "Staff",
      name: "Staff User",
      isActive: true,
    
    },
    "teacher@gmail.com": {
      password: "tech@123",
      role: "Admin",
      name: "Admin User",
      isActive: true,
     
    }
  };

  const handleTogglePassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const login = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password!");
      return;
    }

    const user = hardcodedUsers[email];
    
    if (!user) {
      toast.error("User not found!");
      return;
    }

    if (user.password !== password) {
      toast.error("Incorrect password!");
      return;
    }

    if (!user.isActive) {
      toast.error("This account is inactive!");
      return;
    }

    // Store user data in localStorage
    localStorage.setItem("User", JSON.stringify(user));
    localStorage.setItem("currentUser", true);
    localStorage.setItem("role", user.role);
    
    
 

    toast.success(`Welcome ${user.name}!`);
    setCurrentUser(true);
    navigate("/");
  };

  useEffect(() => {
    if (localStorage.getItem("currentUser")) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Toaster />
      <div
        style={{
          backgroundImage:
            "url(https://cf.bstatic.com/xdata/images/hotel/max1024x768/547211264.jpg?k=b959e59a2a5611d0b9bdedae3e9b1290fca7e11c23f60b5d4c2b9e72d8814b91&o=&hp=1)",
        }}
        className="hero min-h-screen bg-base-200"
      >
        <div className="hero-overlay bg-opacity-70"></div>
        <div className="hero-content max-w-5xl flex-col md:gap-16 lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl w-full font-bold text-white">
              ASHOKA HOTEL
            </h1>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-control relative">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  className="input input-bordered pr-10"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute right-3 top-12 text-gray-500"
                  onClick={handleTogglePassword}
                >
                  {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
                </button>
              </div>

              <div className="form-control mt-6">
                <button
                  onClick={login}
                  className="btn btn-primary"
                >
                  Login
                </button>
              </div>
              
           
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;