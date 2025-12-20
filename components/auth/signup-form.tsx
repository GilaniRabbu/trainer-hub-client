/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, User, Building2 } from "lucide-react";
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
  experienceYears: number;
  hourlyRate: number;
  bio: string;
  role: "USER" | "SERVICE_PROVIDER";
}

const VALID_PROFESSIONS = [
  "Fitness Instructor",
  "Yoga Instructor",
  "Chiropractor",
  "Boxing Trainer",
  "Dance Instructor",
  "Singing Coach",
  "Meditation Coach",
  "Nutrition Coach",
] as const;

export default function SignupForm() {
  const [userType, setUserType] = useState<"USER" | "SERVICE_PROVIDER">("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    experienceYears: 0,
    hourlyRate: 0,
    bio: "",
    role: "USER",
  });

  // Sync role when user switches type
  useEffect(() => {
    setFormData((prev) => ({ ...prev, role: userType }));
  }, [userType]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "location",
    ] as const;
    for (const field of required) {
      if (!formData[field].trim()) {
        setError(
          `Please enter your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
        );
        return;
      }
    }

    if (userType === "SERVICE_PROVIDER") {
      if (!formData.profession) {
        setError("Please select your profession");
        return;
      }
      if (formData.experienceYears < 0) {
        setError("Experience years cannot be negative");
        return;
      }
      if (formData.hourlyRate <= 0) {
        setError("Hourly rate must be greater than 0");
        return;
      }
    }

    try {
      setLoading(true);

      const submissionData: any = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        location: formData.location.trim(),
        role: userType,
      };

      if (userType === "SERVICE_PROVIDER") {
        submissionData.profession = formData.profession;
        submissionData.experienceYears = Number(formData.experienceYears);
        submissionData.hourlyRate = Number(formData.hourlyRate);
        submissionData.bio = formData.bio.trim() || undefined;
      }

      console.log("Submit Data:", submissionData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASEURL}/users/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Signup failed");
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Account created successfully!");
        router.push("/login");
      } else {
        throw new Error(data.message || "Signup failed");
      }
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-16 lg:py-20">
      <div className="max-w-xl w-full mx-auto px-4 md:px-6 lg:px-8">
        <div className="p-8 rounded-xl shadow bg-gray-50 dark:bg-gray-900">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Create Your Account
            </h1>
          </div>

          {/* Role Toggle */}
          <div className="mb-8">
            <div className="flex rounded-lg p-1 bg-gray-100 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => setUserType("USER")}
                className={`flex flex-1 items-center justify-center gap-2 py-3 rounded-md font-medium transition-all ${
                  userType === "USER"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <User className="w-4 h-4" /> Customer
              </button>
              <button
                type="button"
                onClick={() => setUserType("SERVICE_PROVIDER")}
                className={`flex flex-1 items-center justify-center gap-2 py-3 rounded-md font-medium transition-all ${
                  userType === "SERVICE_PROVIDER"
                    ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <Building2 className="w-4 h-4" /> SERVICE PROVIDER
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg outline-none
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-gray-500"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg outline-none
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-gray-500"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg outline-none
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            focus:ring-2 focus:ring-gray-500"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg outline-none
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            focus:ring-2 focus:ring-gray-500"
            />

            <input
              type="text"
              name="location"
              placeholder="City / Location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg outline-none
            bg-white dark:bg-gray-800
            border border-gray-300 dark:border-gray-700
            text-gray-900 dark:text-gray-100
            focus:ring-2 focus:ring-gray-500"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 rounded-lg outline-none
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 dark:text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 rounded-lg outline-none
              bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-700
              text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-500 dark:text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Trainer Fields */}
            {userType === "SERVICE_PROVIDER" && (
              <>
                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg outline-none
                bg-white dark:bg-gray-800
                border border-gray-300 dark:border-gray-700
                text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Select Your Profession</option>
                  {VALID_PROFESSIONS.map((prof) => (
                    <option key={prof} value={prof}>
                      {prof}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="experienceYears"
                    placeholder="Years of Experience"
                    value={formData.experienceYears || ""}
                    onChange={handleChange}
                    required
                    min="0"
                    className="px-4 py-3 rounded-lg outline-none
                  bg-white dark:bg-gray-800
                  border border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-gray-500"
                  />
                  <input
                    type="number"
                    name="hourlyRate"
                    placeholder="Hourly Rate ($)"
                    value={formData.hourlyRate || ""}
                    onChange={handleChange}
                    required
                    min="1"
                    className="px-4 py-3 rounded-lg outline-none
                  bg-white dark:bg-gray-800
                  border border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-gray-100
                  focus:ring-2 focus:ring-gray-500"
                  />
                </div>

                <textarea
                  name="bio"
                  placeholder="Short bio (optional)"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg outline-none resize-none
                bg-white dark:bg-gray-800
                border border-gray-300 dark:border-gray-700
                text-gray-900 dark:text-gray-100
                focus:ring-2 focus:ring-gray-500"
                />
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-lg font-semibold transition-all
            bg-gray-900 text-gray-100 hover:bg-gray-800
            dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200
            disabled:opacity-70"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-gray-900 dark:text-gray-100 hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
