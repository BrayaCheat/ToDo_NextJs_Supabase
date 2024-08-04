import { NextResponse } from "next/server";
import supabase from "../../config/supabaseClient";

type ResponseData = {
  message: string;
};

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("ToDoList")
      .select("*")
      .order("created_at", { ascending: false });
    return NextResponse.json({
      data,
    });
  } catch (error) {
    throw new Error("Fail to fetch data");
  }
}

export async function POST(request: Request) {
  try {
    const { todo } = await request.json();
    const { data: existingData } = await supabase
      .from("ToDoList")
      .select("id")
      .eq("todo", todo)
      .single();

    if (existingData) {
      return NextResponse.json(
        { message: "Task is already exists" },
        { status: 409 }
      );
    }

    const { error } = await supabase.from("ToDoList").insert({
      todo: todo,
      isCompleted: false,
    });

    if (error) {
      throw new Error("Fail to create task!");
    }

    return NextResponse.json({
      message: "Task Created",
    });
  } catch (error) {
    throw new Error("Fail to create task");
  }
}
