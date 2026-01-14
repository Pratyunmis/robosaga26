"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEvent, updateEvent } from "@/lib/admin/actions";
import { eventFormSchema, EventFormData } from "@/lib/admin/schemas";
import { toast } from "sonner";
import { useEffect } from "react";
import { Event } from "./events-data-table";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/date-time-picker";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event;
}

export function EventFormDialog({
  open,
  onOpenChange,
  event,
}: EventFormDialogProps) {
  const isEditing = !!event;

  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category: "hackathon",
      startTime: undefined,
      endTime: undefined,
      maxScore: 100,
      isActive: true,
    },
  });

  useEffect(() => {
    if (event) {
      form.reset({
        name: event.name,
        slug: event.slug,
        description: event.description || "",
        category: event.category,
        startTime: event.startTime ? new Date(event.startTime) : undefined,
        endTime: event.endTime ? new Date(event.endTime) : undefined,
        maxScore: event.maxScore,
        isActive: event.isActive,
      });
    } else {
      form.reset({
        name: "",
        slug: "",
        description: "",
        category: "hackathon",
        startTime: undefined,
        endTime: undefined,
        maxScore: 100,
        isActive: true,
      });
    }
  }, [event, form, open]);

  async function onSubmit(data: EventFormData) {
    try {
      const response =
        isEditing && event
          ? await updateEvent(event.id, data)
          : await createEvent(data);

      if (response.success) {
        toast.success(isEditing ? "Event updated" : "Event created");
        onOpenChange(false);
        form.reset();
      } else {
        toast.error(response.error || "Event operation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Create Event"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of the event."
              : "Add a new event to the system."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="RoboWar 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="robo-war-2026" {...field} />
                  </FormControl>
                  <FormDescription>Unique identifier for URL.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hackathon">Hackathon</SelectItem>
                        <SelectItem value="exhibition">Exhibition</SelectItem>
                        <SelectItem value="competition">Competition</SelectItem>
                        <SelectItem value="workshop">Workshop</SelectItem>
                        <SelectItem value="session">Session</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Score</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value as number}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value as Date | undefined}
                        setDate={field.onChange}
                        placeholder="Pick start time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        date={field.value as Date | undefined}
                        setDate={field.onChange}
                        placeholder="Pick end time"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Short description..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Event"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
