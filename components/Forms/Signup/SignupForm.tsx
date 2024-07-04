import { useEffect, useState } from "react";
import Image from "@/utils/Image";
import { useRouter } from "next/navigation";
import z from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "@/components/Forms/styles.module.css";
import {
  EmailFields,
  PhoneFields,
  SignupSchema,
} from "@/components/Forms/Signup/Helper";
import { Field, SignupEmail, SignupPhone, SignupResponse } from "@/types/types";
import { Signup } from "@/server/actions/Signup";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
// import ReCAPTCHA from "react-google-recaptcha";
// import { CheckRecaptcha } from "@/server/actions/CheckRecaptcha";

type Props = {
  signupWith: "email" | "phone";
};

const SignupForm = ({ signupWith }: Props) => {
  const [btnText, setBtnText] = useState<string>("Next");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<{
    field: string;
    show: boolean;
  }>({ field: "", show: false });
  const [eye, setEye] = useState<string>("/svg/eye-slash.svg");
  // const [recaptchaValue, setRecaptchaValue] = useState<string>("1");

  const eyeToggle = () => {
    setEye((previous) => {
      if (previous === "/svg/eye.svg") {
        return "/svg/eye-slash.svg";
      }
      if (previous === "/svg/eye-slash.svg") {
        return "/svg/eye.svg";
      }
      return previous;
    });
  };

  const toggleShowPassword = (fieldName: string) => {
    eyeToggle();
    setShowPassword((previous) => {
      return {
        field: fieldName,
        show: !previous.show,
      };
    });
  };

  const handleFocus = (fieldName: string) => {
    setEye("/svg/eye-slash.svg");
    setShowPassword({ field: fieldName, show: false });
    setFocusedInput(fieldName);
  };

  const handleBlur = () => {
    setEye("/svg/eye-slash.svg");
    setShowPassword({ field: "", show: false });
    setFocusedInput(null);
  };

  const router = useRouter();

  let Inputs: SignupEmail | SignupPhone;
  let Fields: Field[] = [];

  if (signupWith === "email") {
    Fields = EmailFields;
  } else if (signupWith === "phone") {
    Fields = PhoneFields;
  } else {
    throw new Error("Invalid signupWith value");
  }

  type SignupSchema = z.infer<typeof SignupSchema>;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
    setError,
  } = useForm<SignupSchema>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<SignupSchema> = async (data: SignupSchema) => {
    setShowPassword({ field: "password", show: false });
    setEye("/svg/eye-slash.svg");
    setFocusedInput(null);
    setShowPassword({ field: "confirmPassword", show: false });
    // if (!recaptchaValue) {
    //     setError('checkbox', { message: "Please confirm you are not a robot" });
    //     return;
    // }
    if (signupWith === "email") {
      data.phone = "null";
      const res: SignupResponse = await Signup(data as SignupEmail);
      if (res.success && res.data) {
        reset();
        localStorage.setItem(
          "temp",
          JSON.stringify({
            method: signupWith,
            email: data.email,
            token: res.data.token,
          })
        );
        router.replace("/verify?from=/register&callback=/login");
      } else {
        if (res.error && res.error.key && res.error.message) {
          setError(res.error.key as keyof SignupSchema, {
            message: res.error.message,
          });
        }
      }
    } else if (signupWith === "phone") {
      data.email = "null";
      const res: SignupResponse = await Signup(data as SignupPhone);
      if (res.success && res.data) {
        reset();
        localStorage.setItem(
          "temp",
          JSON.stringify({
            method: signupWith,
            phone: data.phone,
            token: res.data.token,
          })
        );
        router.replace("/verify?from=/register&callback=/login");
      } else {
        if (res.error && res.error.key && res.error.message) {
          setError(res.error.key as keyof SignupSchema, {
            message: res.error.message,
          });
        }
      }
    } else {
      throw new Error("Invalid signupWith value");
    }
  };

  useEffect(() => {
    if (signupWith === "email") {
      reset({ phone: "" });
    } else {
      reset({ email: "" });
    }
  }, [signupWith, reset]);

  useEffect(() => {
    if (isSubmitting || isSubmitSuccessful) {
      setBtnText("Loading...");
    } else {
      setBtnText("Next");
    }
  }, [isSubmitting, isSubmitSuccessful, signupWith]);

  // useEffect(() => {
  //   setTimeout(() => setRecaptchaValue(""), 1000);
  // }, []);

  // const onChangeRecaptcha = async (value: string | null) => {
  //   if (value) {
  //     setRecaptchaValue(value);
  //     try {
  //       const response = await CheckRecaptcha(value);
  //       if (!response.success) {
  //         setRecaptchaValue("");
  //         setError("checkbox", { message: "Error while checking reCAPTCHA" });
  //       }
  //     } catch (error) {
  //       setRecaptchaValue("");
  //       setError("checkbox", { message: "Error while checking reCAPTCHA" });
  //     }
  //   } else {
  //     setRecaptchaValue("");
  //     setError("checkbox", {
  //       message: "Please confirm that you are not a robot",
  //     });
  //   }
  // };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${(isSubmitting || isSubmitSuccessful) && "animate-pulse"}`}
      >
        <div className="transition-transform duration-500 ease-in-out delay-0">
          <div
            className={`transition-transform duration-500 ease-in-out delay-0 transform ${signupWith === "email" ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            {signupWith === "email" &&
              Fields?.map((field: Field, i: number) => (
                <div key={i} className="mb-4">
                  {field.type === "password" ? (
                    <>
                      <div
                        className={`relative ${(isSubmitting || isSubmitSuccessful) &&
                          styles.disabled
                          }`}
                      >
                        <input
                          type={
                            showPassword.field === field.name
                              ? showPassword.show
                                ? "text"
                                : field.type
                              : field.type
                          }
                          className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input
                            } ${(isSubmitting || isSubmitSuccessful) &&
                            styles.disabled
                            }`}
                          placeholder={field.placeholder}
                          {...register(field.name as keyof typeof Inputs)}
                          onFocus={() => handleFocus(field.name)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {focusedInput === field.name ? (
                            <Image
                              className="cursor-pointer"
                              src={eye}
                              alt={field.name}
                              width={25}
                              height={eye === "/svg/eye.svg" ? 25 : 20}
                              onClick={() => toggleShowPassword(field.name)}
                            />
                          ) : (
                            <Image
                              src={field.icon}
                              alt={field.name}
                              width={field.width}
                              height={field.height}
                            />
                          )}
                        </div>
                      </div>
                      {errors[field.name as keyof typeof Inputs] && (
                        <p className="text-red-600 text-[14px]">
                          {errors[field.name as keyof typeof Inputs]?.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <div
                        className={`relative ${(isSubmitting || isSubmitSuccessful) &&
                          styles.disabled
                          }`}
                      >
                        <input
                          type={field.type}
                          className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input
                            } ${(isSubmitting || isSubmitSuccessful) &&
                            styles.disabled
                            }`}
                          placeholder={field.placeholder}
                          {...register(field.name as keyof typeof Inputs)}
                          onFocus={handleBlur}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <Image
                            src={field.icon}
                            alt={field.name}
                            width={field.width}
                            height={field.height}
                          />
                        </div>
                      </div>
                      {errors[field.name as keyof typeof Inputs] && (
                        <p className="text-red-600 text-[14px]">
                          {errors[field.name as keyof typeof Inputs]?.message}
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
          </div>
          <div
            className={`transition-transform duration-500 ease-in-out delay-0 transform ${signupWith === "phone" ? "translate-x-0" : "translate-x-full"
              }`}
          >
            {signupWith === "phone" &&
              Fields?.map((field: Field, i: number) => (
                <div key={i} className="mb-4">
                  {field.type === "password" ? (
                    <>
                      <div
                        className={`relative ${(isSubmitting || isSubmitSuccessful) &&
                          styles.disabled
                          }`}
                      >
                        <input
                          type={
                            showPassword.field === field.name
                              ? showPassword.show
                                ? "text"
                                : field.type
                              : field.type
                          }
                          className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input
                            } ${(isSubmitting || isSubmitSuccessful) &&
                            styles.disabled
                            }`}
                          placeholder={field.placeholder}
                          {...register(field.name as keyof typeof Inputs)}
                          onFocus={() => handleFocus(field.name)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {focusedInput === field.name ? (
                            <Image
                              className="cursor-pointer"
                              src={eye}
                              alt={field.name}
                              width={25}
                              height={eye === "/svg/eye.svg" ? 25 : 20}
                              onClick={() => toggleShowPassword(field.name)}
                            />
                          ) : (
                            <Image
                              src={field.icon}
                              alt={field.name}
                              width={field.width}
                              height={field.height}
                            />
                          )}
                        </div>
                      </div>
                      {errors[field.name as keyof typeof Inputs] && (
                        <p className="text-red-600 text-[14px]">
                          {errors[field.name as keyof typeof Inputs]?.message}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      {field.name === "phone" ? (
                        <>
                          <div
                            className={`relative ${(isSubmitting || isSubmitSuccessful) &&
                              styles.disabled
                              }`}
                          >
                            <Controller
                              name={field.name}
                              control={control}
                              render={({ field }) => (
                                <PhoneInput
                                  defaultCountry={"pk"}
                                  className={`phoneDropdown ${(isSubmitting || isSubmitSuccessful) &&
                                    styles.disabled
                                    }`}
                                  inputClassName={`px-3 py-2 w-full focus:outline-none pr-10 rounded-r-[10px] ${styles.inputNumber
                                    } ${(isSubmitting || isSubmitSuccessful) &&
                                    styles.disabled
                                    }`}
                                  countrySelectorStyleProps={{
                                    buttonContentWrapperClassName: `mx-2`,
                                  }}
                                  inputProps={{
                                    name: field.name,
                                    onFocus: handleBlur,
                                    required: true,
                                  }}
                                  onChange={(value) => {
                                    field.onChange(value);
                                    setValue("phone", value);
                                  }}
                                />
                              )}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <Image
                                src={field.icon}
                                alt={field.name}
                                width={field.width}
                                height={field.height}
                              />
                            </div>
                          </div>
                          {errors[field.name as keyof typeof Inputs] && (
                            <p className="text-red-600 text-[14px]">
                              {
                                errors[field.name as keyof typeof Inputs]
                                  ?.message
                              }
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <div
                            className={`relative ${(isSubmitting || isSubmitSuccessful) &&
                              styles.disabled
                              }`}
                          >
                            <input
                              type={field.type}
                              className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input
                                } ${(isSubmitting || isSubmitSuccessful) &&
                                styles.disabled
                                }`}
                              placeholder={field.placeholder}
                              {...register(field.name as keyof typeof Inputs)}
                              onFocus={handleBlur}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <Image
                                src={field.icon}
                                alt={field.name}
                                width={field.width}
                                height={field.height}
                              />
                            </div>
                          </div>
                          {errors[field.name as keyof typeof Inputs] && (
                            <p className="text-red-600 text-[14px]">
                              {
                                errors[field.name as keyof typeof Inputs]
                                  ?.message
                              }
                            </p>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              ))}
          </div>
        </div>
        <div
          className={`flex flex-col mt-4 mb-12 ${(isSubmitting || isSubmitSuccessful) && styles.disabled
            }`}
        >
          <div className="flex items-center justify-center">
            <input
              className={`${styles.checkbox} ${(isSubmitting || isSubmitSuccessful) && styles.disabled
                }`}
              id="checkbox"
              type="checkbox"
              {...register("checkbox", { required: true })}
            />
            <label
              htmlFor="checkbox"
              className={`text-[9px] text-[#fff] font-[Arial] font-normal ml-1 ${isSubmitting ? styles.disabled : "cursor-pointer"
                }`}
            >
              By checking the box you agree to our{" "}
              <a
                href="/downloads/docs/stocky-terms-&-conditions.pdf"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                <span className="text-[#FFC60A]">Terms</span> and{" "}
                <span className="text-[#FFC60A]">Conditions</span>
              </a>
              .
            </label>
          </div>
          {errors.checkbox && <p className="text-red-600 text-center text-[14px] mt-1">{errors.checkbox?.message}</p>}
        </div>
        {/* {!recaptchaValue ? <div className="-mt-6 -mb-2 ml-2">
          <ReCAPTCHA
            sitekey="6Lc1-ospAAAAAOMLyS_mUTRT1ZhqjgUCsd6tcVuf"
            onChange={onChangeRecaptcha}
            theme="dark"
          />
        </div>
          : */}
          <button
            disabled={isSubmitting}
            type="submit"
            className={`w-full custom-button ${(isSubmitting || isSubmitSuccessful) && "disabled"
              }`}
          >
            {btnText}{" "}
            <Image
              className={`${isSubmitting || isSubmitSuccessful ? "hidden" : "ml-2"
                }`}
              src="/svg/arrow-right.svg"
              alt="next"
              width={8}
              height={14}
            />
          </button>
        {/* } */}
      </form>
    </>
  );
};

export default SignupForm;
