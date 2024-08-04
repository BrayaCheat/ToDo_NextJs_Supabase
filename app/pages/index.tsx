"use client";

import React, { useEffect, useState } from "react";
import { todo_item } from "../types/todo_item";
import Card from "../components/my_card";
import { Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";
import supabase from "../config/supabaseClient";

const HomePage = () => {
  const [data, setData] = useState<todo_item[]>([]);
  const [input, setInput] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [notFoundMessage, setNotFoundMessage] = useState<string>(
    "No result. Create a new one instead!"
  );

  useEffect(() => {
    fetchData();

    supabase
      .channel("realTimeTask")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ToDoList",
        },
        (payload: any) => {
          console.log(payload);
        }
      )
      .subscribe();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/todo");
      const tasks = await res.json();
      setData(tasks.data);
    } catch (error) {
      console.error("Unexpected error", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!input.trim()) {
      toast.error("Field can't be blank");
      return;
    }

    try {
      const res = await fetch("/api/todo", {
        method: "POST",
        body: JSON.stringify({
          todo: input,
        }),
      });

      const RESPONSE_MESSAGE = await res.json();
      if (RESPONSE_MESSAGE.message === "Task is already exists") {
        toast.error(`${RESPONSE_MESSAGE.message}`);
        return;
      }
      toast.success(`${RESPONSE_MESSAGE.message}`);
      setInput("");
      fetchData();
    } catch (error) {
      toast.error("Unexpected error occurred");
      console.error("Unexpected error", error);
    }
  };

  const handleActionComplete = () => {
    fetchData(); // Refetch data after an action is completed
  };

  const filteredData = data.filter((item) =>
    query.toLowerCase() === "" ? item : item.todo.toLowerCase().includes(query)
  );

  return (
    <main className="md:w-[900px] w-full md:p-10 p-3 m-auto h-[900px] overflow-auto  border rounded-md shadow-sm bg-white flex flex-col gap-9 relative">
      {/* title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="md:text-xl text-sm">To Do List -</h1>
          <a
            className="underline md:text-xl text-sm"
            href="https://braya-cheat.vercel.app/"
            target="_blank"
          >
            Braya Cheat
          </a>
        </div>

        <div className="md:w-[300px] w-full">
          <Input
            placeholder="Search for task..."
            startContent={
              <Icon icon="mdi:magnify" className="w-6 h-6 text-gray-500" />
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* form */}
      <form className="w-full flex items-center gap-9" onSubmit={handleSubmit}>
        <Input
          type="text"
          label="Add Todo"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>

      {/* card_component */}
      <div className="overflow-y-scroll">
        {!filteredData.length ? (
          <p className="text-center text-gray-500">
            {query.toLowerCase() === ""
              ? "No todo found"
              : "No result. Create a new one instead!"}
          </p>
        ) : (
          <div className="flex flex-col gap-9">
            {filteredData.map((item) => (
              <Card
                key={item.id}
                item={item}
                onActionCompleted={handleActionComplete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
