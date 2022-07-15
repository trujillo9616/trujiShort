import type { NextPage } from "next";
import { useState } from "react";
import classNames from "classnames";
import { nanoid } from "nanoid";
import debounce from "lodash/debounce";
import { trpc } from "../../utils/trpc";
import copy from "copy-to-clipboard";
import { Spacer, Tooltip } from "@nextui-org/react";

type Form = {
  slug: string;
  url: string;
};

const CreateLinkForm: NextPage = () => {
  const [form, setForm] = useState<Form>({ slug: "", url: "" });
  const url = window.location.origin;
  const regex = /https?:\/\/www.|https?:\/\//gi;

  const slugCheck = trpc.useQuery(["slugCheck", { slug: form.slug }], {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const createSlug = trpc.useMutation(["createSlug"]);

  const input =
    "text-white my-1 p-2 bg-transparent border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none block w-full rounded-md sm:text-sm border-b-4 focus:ring-0";

  const slugInput = classNames(input, {
    "text-red-500": slugCheck.isFetched && slugCheck.data!.used,
  });

  if (createSlug.status === "success") {
    return (
      <>
        <h1 className="text-8xl mt-10 mb-3 text-center md:text-9xl">You're Welcome.</h1>
        <Spacer y={4} />
        <div className="grid gap-8 items-start justify-center mt-3">
            <div className="relative group">
              <div
                className="
            absolute
            -inset-0.5
            bg-gradient-to-r
            from-pink-600
            to-purple-600
            rounded-lg
            blur
            opacity-75
            group-hover:opacity-100
            transition
            duration-1000
            group-hover:duration-200"
              ></div>
              <div
                className="relative px-7 py-4 bg-black rounded-lg leading-none
          flex items-center"
              >
                <span className="pr-6 text-gray-100">{`${url.replace(regex, "")}/${form.slug}`}</span>
                <Tooltip content={"Copy to clipboard!"} color="secondary" >
                  <button
                    onClick={() => copy(`${url.replace(regex, "")}/${form.slug}`)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
          <Spacer y={2} />
          <input
            type="button"
            value="Reset"
            className="rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
            p-2 font-bold cursor-pointer shadow-lg shadow-purple-500/50"
            onClick={() => {
              createSlug.reset();
              setForm({ slug: "", url: "" });
            }}
          />
      </>
    );
  }

  return (
    <>
      <h1 className="text-8xl mt-10 mb-3 text-center md:text-9xl">Links made easy.</h1>
      <Spacer y={4} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createSlug.mutate({ ...form });
        }}
        className="flex flex-col justify-center items-center"
      >
        {slugCheck.data?.used && (
          <span className="font-medium mr-2 text-center text-red-500">
            Slug already in use.
          </span>
        )}
        <div className="mx-3">
          <div className="flex flex-col gap-8 mt-3">
            <div className="relative group">
              <div
                className="
            absolute
            -inset-0.5
            bg-gradient-to-r
            from-pink-600
            to-purple-600
            rounded-lg
            blur
            opacity-75
            group-hover:opacity-100
            transition
            duration-1000
            group-hover:duration-200"
              ></div>
              <div
                className="relative px-7 py-4 bg-black rounded-lg leading-none
          flex items-center divide-x divide-gray-600"
              >
                <span className="flex items-center space-x-1 md:space-x-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="pr-6 text-gray-100 text-xs md:text-lg">{url.replace(/^https?:\/\/www./, "")}</span>
                </span>
                <span className="flex items-center space-x-3">
                  <input
                    type="text"
                    onChange={(e) => {
                      setForm({
                        ...form,
                        slug: e.target.value,
                      });
                      debounce(slugCheck.refetch, 100);
                    }}
                    minLength={1}
                    placeholder="Type here..."
                    className={`pl-6 text-indigo-400
                    group-hover:text-indigo-300 transition duration-200 
                    bg-transparent border-none focus:ring-0 text-sm md:text-lg ${slugInput}`}
                    value={form.slug}
                    pattern={"^[-a-zA-Z0-9]+$"}
                    title="Only letters, numbers, and dashes :)"
                    required
                  />
                  <button
                    onClick={() => {
                      const slug = nanoid(6);
                      setForm({
                        ...form,
                        slug,
                      });
                      slugCheck.refetch();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </span>
              </div>
            </div>
          </div>
        <Spacer y={1} />
        <input
          type="url"
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder="https://ridiculouslylonglinkthatisobvioulsynotreal.com"
          className="text-white my-1 p-2 bg-transparent border-0
          shadow-sm border-slate-300 placeholder-slate-400 
          focus:outline-none block w-full text-sm md:text-lg 
          border-b-2
          focus:ring-0"
          required
        />
        <Spacer y={1} />
        <input
          type="submit"
          value="Shorten Link"
          className="rounded bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
          p-2 font-bold cursor-pointer shadow-lg shadow-purple-500/50 w-full"
          disabled={slugCheck.isFetched && slugCheck.data!.used}
        />
        <Spacer y={2} />
        </div>
      </form>
    </>
  );
};

export default CreateLinkForm;
