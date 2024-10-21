"use client"

import { Button } from "@/components/ui/button"
import { dialogStore } from "./DialogMessage";

export  const DialogDemo = () => {

    const { setDialog } = dialogStore((state) => state);


    return (

<Button onClick={ e =>  setDialog({ 
                title: "success_title",
                description: "success_description",
                 
                open: true,
                cancelButton: undefined,
                submitButton: {
                  children: "ok",
                },
              }) }> open dialog </Button>

    )
}