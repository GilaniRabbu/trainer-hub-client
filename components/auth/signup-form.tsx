/*eslint-disable*/
"use client";

import { useState } from "react";
import { Eye, EyeOff, User, Building2, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  location: string;
  profession: string;
  experienceYears: string;
  hourlyRate: number;
  bio: string;
  role: string;
}

export default function SignupForm() {
  const [userType, setUserType] = useState<"CUSTOMER" | "SERVICE_PROVIDER">(
    "CUSTOMER"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    profession: "",
    experienceYears: "",
    hourlyRate: 0,
    bio: "",
    role: "CUSTOMER", // Initialize with default, will be updated dynamically
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
      role: userType,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Invalid password: Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Invalid password: Password must be at least 8 characters long");
      return;
    }

    // Validate required provider fields
    if (userType === "SERVICE_PROVIDER") {
      if (
        !formData.profession ||
        !formData.experienceYears ||
        !formData.hourlyRate
      ) {
        setError("Please fill out all required provider fields");
        return;
      }
    }

    try {
      setLoading(true);
      // Prepare data for submission, excluding confirmPassword
      const { confirmPassword, ...restData } = formData;
      const { bio, profession, experienceYears, hourlyRate, ...customerData } =
        restData;
      let submissionData;

      if (userType === "CUSTOMER") {
        submissionData = customerData;
      } else {
        submissionData = {
          ...restData,
          experienceYears: parseInt(experienceYears) || 0, // Convert experienceYears to number
          hourlyRate: hourlyRate || 0, // Ensure hourlyRate is also a number
        };
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/users/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      const responseData = await response.json();

      if (responseData.success) {
        toast.success("Account Created Successfully");
        router.push("/login");
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
      const errorMessage =
        err.message || "An error occurred during signup. Please try again.";
      setError(errorMessage);
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="py-12 md:py-16 lg:py-20">
      <div className="max-w-xl w-full mx-auto px-4 md:px-6 lg:px-8">
        <div className="p-8 rounded-xl shadow bg-white dark:bg-slate-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#008531] dark:text-[#71EE61]">
              Create Your Account
            </h1>
          </div>

          <div className="mb-8">
            <div className="flex rounded-lg p-1 bg-gray-100 dark:bg-gray-700">
              <button
                onClick={() => setUserType("CUSTOMER")}
                className={`flex flex-1 items-center justify-center cursor-pointer text-sm font-medium px-4 py-3 rounded-md transition-all ${
                  userType === "CUSTOMER"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:dark:text-gray-100"
                }`}
              >
                <User className="w-4 h-4 mr-2" />
                Customer Registration
              </button>
              <button
                onClick={() => setUserType("SERVICE_PROVIDER")}
                className={`flex flex-1 items-center justify-center cursor-pointer text-sm font-medium px-4 py-3 rounded-md transition-all ${
                  userType === "SERVICE_PROVIDER"
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:dark:text-gray-100"
                }`}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Service Provider
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium"
                >
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md px-3 py-2 outline-none"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full border rounded-md px-3 py-2 outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2 outline-none"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password *
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 cursor-pointer pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium"
                >
                  Confirm Password *
                </label>
                <div className="relative mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 cursor-pointer pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="City, State"
                value={formData.location}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2 outline-none"
              />
            </div>

            {userType === "SERVICE_PROVIDER" && (
              <>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="profession"
                      className="block text-sm font-medium"
                    >
                      Profession *
                    </label>
                    <select
                      id="profession"
                      name="profession"
                      required={userType === "SERVICE_PROVIDER"}
                      value={formData.profession}
                      onChange={handleChange}
                      className="cursor-pointer mt-1 block w-full border rounded-md px-3 py-2 outline-none bg-white dark:bg-slate-800"
                    >
                      <option value="">Select your profession</option>
                      <option value="Electrician">Yoga Instructor</option>
                      <option value="Plumber">Chiropractor</option>
                      <option value="Painter">Athletic Trainer</option>
                      <option value="Cleaner">Pilates Instructor</option>
                      <option value="Mechanic">Personal Trainer</option>
                      <option value="AC Repair">Meditation Coach</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="experienceYears"
                      className="block text-sm font-medium"
                    >
                      Years of Experience *
                    </label>
                    <select
                      id="experienceYears"
                      name="experienceYears"
                      required={userType === "SERVICE_PROVIDER"}
                      value={formData.experienceYears}
                      onChange={handleChange}
                      className="cursor-pointer mt-1 block w-full border rounded-md px-3 py-2 outline-none bg-white dark:bg-slate-800"
                    >
                      <option value="">Select experience</option>
                      <option value="0">0-1 years</option>
                      <option value="2">2-5 years</option>
                      <option value="6">6-10 years</option>
                      <option value="10">10+ years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="hourlyRate"
                    className="block text-sm font-medium"
                  >
                    Hourly Rate (in BDT) *
                  </label>
                  <input
                    id="hourlyRate"
                    name="hourlyRate"
                    type="number"
                    required={userType === "SERVICE_PROVIDER"}
                    min="0"
                    placeholder="e.g., 500"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about your experience and design philosophy..."
                    value={formData.bio}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded-md px-3 py-2 outline-none"
                    rows={4}
                  />
                </div>
              </>
            )}

            {error && (
              <div
                className="border bg-red-100 border-red-400 text-red-700 relative px-4 py-3 mb-4 rounded"
                role="alert"
              >
                <span className="block md:inline">{error}</span>
              </div>
            )}

            <label
              htmlFor="terms"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                id="terms"
                className="peer hidden"
                required
              />
              <div className="w-5 h-5 rounded flex items-center justify-center transition-colors border-2 border-label peer-checked:bg-label">
                <Check className="w-4 h-4 text-white dark:text-slate-800" />
              </div>
              <p className="text-sm text-muted-foreground leading-5 cursor-pointer">
                I agree to the{" "}
                <Link href="/terms" className="text-label">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-label">
                  Privacy Policy
                </Link>
              </p>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full cursor-pointer px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  isLoading
                    ? "bg-lime text-[#95FE8A] dark:text-[#202020] cursor-not-allowed"
                    : "bg-lime text-[#71EE61] dark:text-[#121212] focus:ring-ring"
                }
              `}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-label">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
