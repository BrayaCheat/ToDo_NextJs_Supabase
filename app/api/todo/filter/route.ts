import supabase from "@/app/config/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    if (request.method === "GET") {
      const url = new URL(request.url);
      const query = url.searchParams.get("query") || "";

      const { data, error } = await supabase
        .from("ToDoList")
        .select("*")
        .ilike("todo", `%${query}%`);

      if (error) {
        return NextResponse.json(
          {
            message: "Failed with supabase",
          },
          { status: 500 }
        );
      }

      if (!data.length) {
        return NextResponse.json(
          {
            message: "Task not found",
          },
          { status: 404 }
        );
      }
      return NextResponse.json({
        data: data,
      });
    } else {
      return NextResponse.json(
        {
          message: "Method not allowed",
        },
        { status: 405 }
      );
    }
  } catch (error) {
    return NextResponse.json({
      message: "Fail to filter the task"
    }, {status: 404})
  }
}
