import supabase from "@/app/config/supabaseClient";
import { NextResponse } from "next/server";

const ERROR_MESSAGE = "Invalid id";

export async function DELETE(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        {
          message: ERROR_MESSAGE,
        },
        { status: 400 }
      );
    }
    const { error } = await supabase.from("ToDoList").delete().eq("id", id);
    return NextResponse.json({
      message: "Task Deleted",
    });
  } catch (error) {
    throw new Error("Fail to delete task");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        {
          message: ERROR_MESSAGE,
        },
        { status: 400 }
      );
    }
    const { todo, isCompleted } = await request.json();
    console.log(todo);
    if (!todo) {
      return NextResponse.json(
        {
          message: "Todo is missing",
        },
        { status: 400 }
      );
    }
    const { error } = await supabase
      .from("ToDoList")
      .update({
        todo: todo,
        isCompleted: isCompleted,
      })
      .eq("id", id);

    return NextResponse.json({
      message: "Task Updated",
    });
  } catch (error) {
    throw new Error("Fail to update task");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = params;
    const { isCompleted } = await request.json();
    if (!id) {
      return NextResponse.json({
        message: ERROR_MESSAGE,
      });
    }
    const { error } = await supabase
      .from("ToDoList")
      .update({
        isCompleted: isCompleted,
      })
      .eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return NextResponse.json({
      message: "Mark as done completed!",
    });
  } catch (error) {
    throw new Error("Fail to update the status");
  }
}
