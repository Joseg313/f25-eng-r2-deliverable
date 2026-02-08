import type { Database } from "@/lib/schema";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
type Species = Database["public"]["Tables"]["species"]["Row"]

export default function SpeciesDetailsDialog({ species }: { species: Species }) {



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
        {species.total_population  && <DialogDescription><b>Population:</b> {species.total_population}</DialogDescription>}
        {species.kingdom  && <DialogDescription><b>Kingdom:</b> {species.kingdom}</DialogDescription>}
        {species.description  && <DialogDescription><b>Description: </b> {species.description}</DialogDescription>}



        {/* TODO: form*/}
      </DialogContent>

    </Dialog>
  );
}
