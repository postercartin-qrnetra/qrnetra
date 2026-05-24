"use client";

import {
  Bell,
  Car,
  HeartPulse,
  Key,
  MapPin,
  PawPrint,
  QrCode,
  School,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type HeroEvent = {
  title: string;
  location: string;
  time: string;
  icon: typeof Car;
};

const EVENTS: HeroEvent[] = [
  {
    title: "Vehicle owner contacted",
    location: "MG Road, Bengaluru",
    time: "2 min ago",
    icon: Car,
  },
  {
    title: "Pet profile viewed",
    location: "Bandra West, Mumbai",
    time: "4 min ago",
    icon: PawPrint,
  },
  {
    title: "School bag recovered",
    location: "Salt Lake, Kolkata",
    time: "6 min ago",
    icon: School,
  },
  {
    title: "Emergency contact accessed",
    location: "Connaught Place, Delhi",
    time: "8 min ago",
    icon: HeartPulse,
  },
  {
    title: "Wrong parking alert sent",
    location: "Hitech City, Hyderabad",
    time: "11 min ago",
    icon: Bell,
  },
  {
    title: "Child safety profile opened",
    location: "Anna Nagar, Chennai",
    time: "14 min ago",
    icon: ShieldCheck,
  },
  {
    title: "Pet identified successfully",
    location: "Koregaon Park, Pune",
    time: "18 min ago",
    icon: PawPrint,
  },
  {
    title: "Keychain scanned",
    location: "Sector 29, Gurugram",
    time: "21 min ago",
    icon: Key,
  },
  {
    title: "QR profile viewed",
    location: "Park Street, Kolkata",
    time: "24 min ago",
    icon: QrCode,
  },
  {
    title: "Owner notified instantly",
    location: "Indiranagar, Bengaluru",
    time: "27 min ago",
    icon: Bell,
  },
  {
    title: "Lost item located",
    location: "Jubilee Hills, Hyderabad",
    time: "31 min ago",
    icon: MapPin,
  },
  {
    title: "Finder connected",
    location: "Andheri East, Mumbai",
    time: "35 min ago",
    icon: UserCheck,
  },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type CardSlotProps = {
  className?: string;
  startOffset: number;
};

function NotificationCard({ event }: { event: HeroEvent }) {
  const Icon = event.icon;
  return (
    <div className="qn-glass rounded-2xl p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-qn-accent/15 text-qn-accent">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-qn-muted">
            Live across India
          </p>
          <p className="mt-0.5 text-sm font-semibold text-white">{event.title}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-qn-muted">
            <MapPin className="h-3 w-3 shrink-0 text-qn-accent" />
            {event.location}
          </p>
          <p className="mt-0.5 text-[11px] text-qn-muted-2">{event.time}</p>
        </div>
      </div>
    </div>
  );
}

function RotatingCard({ className, startOffset }: CardSlotProps) {
  const sequence = useMemo(() => shuffle(EVENTS), []);
  const [index, setIndex] = useState(startOffset % sequence.length);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % sequence.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [sequence.length]);

  const event = sequence[index];

  return (
    <div className={`absolute z-40 max-w-[220px] ${className ?? ""}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${event.title}-${index}`}
          initial={{ opacity: 0, y: 12, x: 4 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -10, x: -4 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <NotificationCard event={event} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function HeroRotatingNotifications() {
  return (
    <>
      <RotatingCard className="-left-2 bottom-[22%] sm:left-0" startOffset={0} />
      <RotatingCard className="-right-1 top-[18%] sm:right-0" startOffset={4} />
      <RotatingCard
        className="right-[4%] bottom-[6%] hidden max-w-[200px] sm:block"
        startOffset={8}
      />
    </>
  );
}
