"use client"
import { NextPage } from "next";
import { useEffect, useState } from "react";
import Image from '@/utils/Image';
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import z from "zod";
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Loading from "@/app/(app)/(auth)/reset/loading";
import styles from "@/components/Forms/styles.module.css";
import { Field } from "@/types/types";
import { ResetPassword } from "@/server/actions/ResetPassword";
import { useAuth } from "@/contexts/authContext";

type Props = {};
const Reset: NextPage = (props: Props) => {
  const router = useRouter();
  const params = useParams();
  const { token } = params;
  const { sessionStatus, session } = useAuth();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/dashboard");
    }
    if (token.length < 300) {
      router.replace("/login");
    }
  }, [sessionStatus, router, token]);

  const [btnText, setBtnText] = useState<string>("Next");
  const [resetErrors, setResetErrors] = useState<string>("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<{ field: string, show: boolean }>({ field: '', show: false });
  const [eye, setEye] = useState<string>("/svg/eye-slash.svg");

  const eyeToggle = () => {
    setEye((previous) => {
      if (previous === '/svg/eye.svg') {
        return '/svg/eye-slash.svg';
      }
      if (previous === '/svg/eye-slash.svg') {
        return '/svg/eye.svg';
      }
      return previous;
    });
  }

  const toggleShowPassword = (fieldName: string) => {
    eyeToggle();
    setShowPassword((previous) => {
      return {
        field: fieldName,
        show: !previous.show,
      }
    });
  };

  const handleFocus = (fieldName: string) => {
    setEye("/svg/eye-slash.svg");
    setShowPassword({ field: fieldName, show: false });
    setFocusedInput(fieldName);
  };

  type Inputs = {
    password: string;
    confirmPassword: string;
  };

  const ResetFields: Field[] = [
    { type: 'password', name: 'password', placeholder: 'Strong Password', icon: '/svg/lock.svg', width: 24, height: 24 },
    { type: 'password', name: 'confirmPassword', placeholder: 'Re-enter Password', icon: '/svg/lock.svg', width: 24, height: 24 },
  ]

  const ResetSchema = z.object({
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Passwords do not match' }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

  type ResetSchema = z.infer<typeof ResetSchema>;

  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful }, reset, setError } = useForm<ResetSchema>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<ResetSchema> = async (data: ResetSchema) => {
    setShowPassword({ field: 'password', show: false });
    setEye("/svg/eye-slash.svg");
    setFocusedInput(null);
    setResetErrors("");
    setShowPassword({ field: 'confirmPassword', show: false });
    const res: { success: boolean, message: string } = await ResetPassword(data.password, token as string);
    if (res.success) {
      reset();
      router.replace('/login');
    } else {
      setResetErrors(res.message);
      setError("password", { message: "" });
    }
  }

  
  useEffect(() => {
    if (isSubmitting || isSubmitSuccessful) {
      setBtnText('Loading...');
    } else {
      setBtnText('Next');
    }
  }, [isSubmitting, isSubmitSuccessful]);
  
  if (sessionStatus === "loading") {
    return <Loading />;
  }

  return (
    sessionStatus !== "authenticated" && token && (
      <div className="flex min-h-screen flex-col items-center justify-center md:mt-0 md:p-24">
        <div className="p-8 md:rounded-[4rem] md:shadow-lg md:border-2 md:border-[rgba(40,50,68)] w-96">
          <div className="overflow-hidden">
            <span className="text-[#fff] text-center">
              <h1 className="mb-8 flex items-baseline justify-center">
                <span className="stocky flex items-center justify-center">
                  St <Image src="/logo/stocky-logo.png" alt="logo" width={29} height={29} /> cky
                </span>
              </h1>
            </span>
            <h1 className="text-[#fff] text-center text-[20px] font-medium mb-20 md:mb-12">
              Don&apos;t Worry
              <div className="text-[14px] font-normal">You can eaily reset your password</div>
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className={`${(isSubmitting || isSubmitSuccessful) && 'animate-pulse'}`}>
              {ResetFields?.map((field: Field, i: number) => (
                <div key={i} className='mb-4'>
                  <div className={`relative ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}>
                    <input
                      type={showPassword.field === field.name ? showPassword.show ? 'text' : field.type : field.type}
                      className={`w-full px-3 py-2 focus:outline-none pr-10 ${styles.input} ${(isSubmitting || isSubmitSuccessful) && styles.disabled}`}
                      placeholder={field.placeholder}
                      {...register(field.name as keyof Inputs)}
                      onFocus={() => handleFocus(field.name)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {focusedInput === field.name ?
                        <Image
                          className="cursor-pointer"
                          src={eye}
                          alt={field.name}
                          width={25}
                          height={eye === '/svg/eye.svg' ? 25 : 20}
                          onClick={() => toggleShowPassword(field.name)}
                        /> :
                        <Image
                          src={field.icon}
                          alt={field.name}
                          width={field.width}
                          height={field.height}
                        />
                      }
                    </div>
                  </div>
                  {errors[field.name as keyof Inputs] && (
                    <p className="text-red-600 text-[14px]">
                      {errors[field.name as keyof Inputs]?.message}
                    </p>
                  )}
                </div>
              ))}
              {resetErrors !== "" && <p className="text-red-600 text-[14px] mt-2 mb-4 text-center"> {resetErrors} </p>}
              <button disabled={(isSubmitting || isSubmitSuccessful)} type="submit" className={`w-full custom-button ${(isSubmitting || isSubmitSuccessful) && 'disabled'}`}>
                {btnText} <Image className={`${(isSubmitting || isSubmitSuccessful) ? 'hidden' : 'ml-2'}`} src="/svg/arrow-right.svg" alt="next" width={8} height={14} />
              </button>
            </form>
          </div>
          <div className="absolute bottom-12 md:bottom-0 md:static md:mt-20">
            <Link href='/login' className="w-10 block">
              <Image src="/svg/goback.svg" alt="goback" width={49} height={49} />
            </Link>
          </div>
        </div>
      </div>
    )
  );
};

export default Reset;
