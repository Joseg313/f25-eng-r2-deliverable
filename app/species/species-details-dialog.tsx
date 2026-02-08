"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";

import EditSpeciesDialog from "./edit-species-dialog"
type Species = Database["public"]["Tables"]["species"]["Row"];



export default function SpeciesDetailsDialog({ species, sessionId }: { species: Species; sessionId: string | null }) {
  {/*isAuthor checks to see if the current user logged in is the same as the one who authored the species */}
  const isAuthor = sessionId === species.author;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{species.scientific_name}</DialogTitle>
          {species.common_name && <DialogDescription>{species.common_name}</DialogDescription>}
        </DialogHeader>
        {species.total_population && (
          <DialogDescription>
            <b>Population:</b> {species.total_population}
          </DialogDescription>
        )}
        {species.kingdom && (
          <DialogDescription>
            <b>Kingdom:</b> {species.kingdom}
          </DialogDescription>
        )}
        {species.description && (
          <DialogDescription>
            <b>Description: </b> {species.description}
          </DialogDescription>
        )}


        {/* Only show the EditSpeciesDialog button if the author is the current user logged in*/}
        {isAuthor && <EditSpeciesDialog species={species}/>}


        {/*planning for form
          Show the edit button only if current user was one to input species
          onclick of edit button, open up form editing.
        */}


      </DialogContent>
    </Dialog>
  );
}
