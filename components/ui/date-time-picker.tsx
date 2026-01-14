"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
}

export function DateTimePicker({
  date,
  setDate,
  className,
  placeholder = "Pick a date",
}: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    Date | undefined
  >(date);

  React.useEffect(() => {
    if (date) {
      setSelectedDateTime(date);
    }
  }, [date]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setSelectedDateTime(undefined);
      setDate(undefined);
      return;
    }

    const newDateTime = new Date(selectedDate);
    if (selectedDateTime) {
      newDateTime.setHours(selectedDateTime.getHours());
      newDateTime.setMinutes(selectedDateTime.getMinutes());
    } else {
      const now = new Date();
      newDateTime.setHours(now.getHours());
      newDateTime.setMinutes(now.getMinutes());
    }

    setSelectedDateTime(newDateTime);
    setDate(newDateTime);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (!time) return;

    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;

    const newDateTime = selectedDateTime
      ? new Date(selectedDateTime)
      : new Date();
    newDateTime.setHours(hours);
    newDateTime.setMinutes(minutes);

    setSelectedDateTime(newDateTime);
    setDate(newDateTime);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP hh:mm a") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDateTime}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Clock className="ml-2 h-4 w-4 opacity-50" />
            <Input
              type="time"
              value={selectedDateTime ? format(selectedDateTime, "HH:mm") : ""}
              onChange={handleTimeChange}
              className="flex-1"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
