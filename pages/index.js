import Head from "next/head";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import TextInput from "@/components/TextInput";
import SubmitButton from "@/components/SubmitButton";
import ResponseDisplay from "@/components/ResponseDisplay";
import useApi from "@/hooks/useApi";
import { getUserPrompt } from "../prompts/promptUtils";
import { useForm } from "react-hook-form";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const { data, error, loading, fetchData } = useApi();
    const [keepInputs, setKeepInputs] = useState(false);

    const onSubmit = async (form) => {
        await fetchData("/api/openai", "POST", {
            ...getUserPrompt(form),
        });
    };

    useEffect(() => {
        if (error && error.reason === "BAD_REQUEST") setKeepInputs(true);
        if (!keepInputs) reset();
    }, [data, error]);

    return (
        <>
            <Head>
                <title>Short stories generator</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="container">
                <h1 className={inter.className}>
                    Short story generator with AI 🤖
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="form-input">
                    <div
                        style={{
                            width: "700px",
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            columnGap: "12px",
                        }}
                    >
                        <TextInput
                            placeholder={"Targeted age"}
                            inputName="age"
                            register={register}
                            error={errors.age ? errors.age.message : ""}
                            maxCharacters="1"
                        />
                        <TextInput
                            placeholder={"Select genre"}
                            inputName="genre"
                            register={register}
                            error={errors.genre ? errors.genre.message : ""}
                        />
                        <TextInput
                            placeholder={"Type"}
                            inputName="type"
                            register={register}
                            error={errors.type ? errors.type.message : ""}
                        />
                    </div>
                    <ResponseDisplay
                        data={data}
                        error={error}
                        loading={loading}
                    />
                    {error && error.reason === "BAD_REQUEST" && (
                        <div
                            style={{
                                display: "flex",
                                alignContent: "center",
                                fontWeight: "bold",
                            }}
                        >
                            <span>Keep the previous inputs ?</span>
                            <input
                                type="checkbox"
                                name="keepInputs"
                                checked={keepInputs}
                                style={{ height: "20px", width: "20px" }}
                                onChange={() => setKeepInputs(!keepInputs)}
                            />
                        </div>
                    )}
                    <SubmitButton
                        onClick={handleSubmit}
                        disabled={data || loading}
                    />
                </form>
            </main>
        </>
    );
}
