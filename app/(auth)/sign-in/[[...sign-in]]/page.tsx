'use client'

import React, {useEffect, useState} from 'react'
import { Input } from '@/components/ui/input'
import axios from "axios";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/useAuth";
import {Label} from "@/components/ui/label";
import Link from "next/link";
import {IconBrandGithub, IconBrandGoogle, IconBrandTwitter} from "@tabler/icons-react";
import {cn} from "@/lib/utils";
import AuthNoteSignIn from "@/app/(routes)/dashboard/_components/AuthNoteSignIn";
import {Loader2Icon} from "lucide-react";




function SignIn() {
    const {user, loading, setUser} = useAuth()

    console.log(user)

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        email: '',
        password: '',
    })





    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const res = await axios.post('/api/auth/sign-in', form)

        const data = await res.data
        localStorage.setItem("token", data.token)
        // получаем пользователя
        const userRes = await fetch("/api/auth/user", {
            headers: {
                Authorization: `Bearer ${data.token}`,
            },
        });

        if (!userRes.ok) throw new Error("Failed to fetch user");

        const userData = await userRes.json();
        setUser(userData.user); // обновляем контекст
        setIsLoading(false)
        router.replace('/dashboard')

        toast.success('Вы успешно вошли в аккаунт')
    }

    useEffect(() => {
        if (user) {
            router.replace("/dashboard");
        }
    }, [user]);

    return (
        <div className='flex items-center flex-col md:flex-row-reverse justify-center gap-20'>
            <div
                className="shadow-input  w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
                <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                    Приветствуем снова в AI-Doctors
                </h2>
                <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                   Войдите аккаунт чтобы продолжить пользоваться нашей платформой!
                </p>

                <form className="my-8" onSubmit={handleLogin}>

                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">Электронная почта</Label>
                        <Input id="email" onChange={(e) => setForm({...form, email: e.target.value})} value={form.email}
                               placeholder="projectmayhem@fc.com" type="email"/>
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">Пароль</Label>
                        <Input onChange={(e) => setForm({...form, password: e.target.value})} value={form.password}
                               id="password" placeholder="••••••••" type="password"/>
                    </LabelInputContainer>


                    <button
                        className="group/btn flex justify-center items-center cursor-pointer relative block h-10 w-full rounded-md bg-gradient-to-br from-blue-600 to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
                        type="submit"
                    >
                        {isLoading && <Loader2Icon className='animate-spin size-4'/>}
                        Войти в аккаунт &rarr;
                        <BottomGradient/>
                    </button>
                    <Link href="/sign-up"><p className='text-center text-sm text-gray-700 mt-2'>Впервые здесь? Зарегистироваться</p></Link>

                    <div
                        className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700"/>

                    <div className="flex flex-col space-y-4">
                        <button
                            className="group/btn  cursor-pointer shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                            type="submit"
                        >
                            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300"/>
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              GitHub
            </span>
                            <BottomGradient/>
                        </button>
                        <button
                            className="group/btn  cursor-pointer shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                            type="submit"
                        >
                            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300"/>
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Google
            </span>
                            <BottomGradient/>
                        </button>
                        <button
                            className="group/btn  cursor-pointer shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
                            type="submit"
                        >
                            <IconBrandTwitter className="h-4 w-4 text-neutral-800 dark:text-neutral-300"/>
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Twitter
            </span>
                            <BottomGradient/>
                        </button>
                    </div>
                </form>
            </div>
            <div className='flex items-center justify-center'>
                <AuthNoteSignIn/>
            </div>

        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span
                className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100"/>
            <span
                className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100"/>
        </>
    );
};

const LabelInputContainer = ({
                                 children,
                                 className,
                             }: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex w-full flex-col space-y-2", className)}>
            {children}
        </div>
    );
};
export default SignIn