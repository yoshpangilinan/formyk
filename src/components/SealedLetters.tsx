import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FallingCharacters from "./FallingCharacters";

interface Props {
  onNext: () => void;
}

const LETTERS = [
  {
    from: "the version of me before you",
    message:
      "i think about who i was before this a lot more than i probably should. not in a sad way, just curious. i was fine. i had my routines, my friends, my usual way of getting through a day, and none of it felt like it was missing something because i didn't know yet what i was missing.\n\nthen you happened, kind of slowly and then all at once, and i started noticing the shape of the person i used to be next to the shape of who i am now. i check my phone differently now. i plan my days around when we'll get to talk. i've started saying things out loud that old me would have just kept quiet, because you make it easy to say them.\n\ni'm not going to pretend the old version of me was worse. he was fine. he just didn't know what he was capable of feeling until you gave him a reason to feel it. i like this version more. i like him because he's yours, and because loving you turned out to be the thing i didn't know i was waiting to do.\n\nthank you for that, i guess. for being the reason i got to meet a better version of myself.\n\nyours,\nyoshi",
  },
  {
    from: "our discord calls",
    message:
      "there's this thing we do now where we don't really hang up anymore. we just leave the call open until both of us fall asleep, whichever one of us goes first. no real ending to it, just a call that quietly turns into background noise and then into nothing.\n\ni used to think good conversations needed a point to them. a topic, a purpose, something to actually talk about. you ruined that theory pretty fast. some of my favorite calls with you are the ones where neither of us is even talking. you doing your own thing on your end, me doing mine, both of us just existing in the same space even if it's only through a screen.\n\nyou get sleepy sometimes in the middle of it and it might be one of my favorite versions of you. you go quiet, clingier than usual, less words but more wanting to stay on the call even though you know you should sleep. i notice the shift every time, from normal you to sleepy you, and i never want to be the one who says okay let's hang up.\n\ni don't know when exactly falling asleep on a call with you became one of my favorite feelings, but it did. and i'm not in a rush to fix that.",
  },
  {
    from: "the timezone we cheat sometimes",
    message:
      "we do this thing where we try to compromise the six hour gap instead of just accepting it. you push your sleep earlier, i push mine later, and somewhere in the middle there's this small window where it almost feels like we're in the same place doing the same version of a day.\n\nthat window is where most of our actual life together happens. we eat during it, both of us with our own plates on our own sides of the world, but eating together anyway. we do random things while still on call, just narrating whatever we're doing to each other. it's not glamorous but it's ours.\n\nwe don't really pause dramas anymore either. we just watch and react to whatever's happening, typing it out in the chat mid scene instead of stopping to talk about it. we used to only watch things at night, mics off, just chat reactions back and forth. today we actually tried unmuting and watching live instead, letting the reactions happen out loud. small thing, but it felt different, better, like we were actually in the same room instead of just synced up on a schedule.\n\nit's fun in a way i didn't expect, the two of us alone in our own spaces but somehow still existing together through it. i know it's not sustainable long term, all these weird alarms and rearranged sleep schedules. but i keep doing it anyway because that overlapping hour matters more to me than the extra sleep does.\n\nsomeday the math won't matter as much. until then, i'll keep pushing my bedtime for you.",
  },
  {
    from: "why i started writing to you like this",
    message:
      "i get asked sometimes, mostly by myself honestly, why i bother writing things down instead of just saying them. we talk every day. i could say all of this out loud if i wanted to. so why build a whole page of letters for someone i already tell everything to.\n\nit's not that i think talking gets forgotten. i remember our conversations, most of them anyway. but writing it down means there's something to come back to, specifically, on the nights i miss you more than usual. you can open this page on a random tuesday and read the exact same thing i meant the first time, and i can do the same when i miss you. it's less about not trusting memory and more about having somewhere to go when the missing gets loud.\n\ni also think there's something different about the version of me that writes versus the version that talks. when i talk to you i'm reacting, keeping up, being present in the moment. when i write to you i get to actually think about what i mean. i get to be more careful with it, more honest in a slower way. it's a different kind of truth, not more real than the spoken kind, just harder to reach in the middle of a normal day.\n\nso that's why. because i wanted a place where the things i feel about you don't have to compete with everything else that's happening. where they get to just sit there, fully said, waiting for you whenever you need them.\n\ni hope you keep coming back to this page long after we've run out of new things to add to it.\n\nalways,\nyoshi",
  },
  {
    from: "your name",
    message:
      "kristína. i like saying it, more than i probably let on. i've never really been a person who bothers with names much, i don't think i've ever actually asked half the people i know what their government name is. it's just not something i usually care about.\n\nyours is different. i like typing it too, which is a strange thing to admit, but there's something about seeing your actual name instead of a nickname that makes it feel more real, more solid.\n\ni honestly don't even know how many ways i say it at this point. it changes depending on the mood, sometimes soft, sometimes a little dramatic, sometimes it's basically just a sound i make when you've done something that makes me unreasonably happy. i've stopped trying to keep track.\n\nnames are supposed to be neutral, just labels, but yours stopped being neutral to me a long time ago. now it just means something good is about to happen, because you're usually attached to it.",
  },
  {
    from: "good morning, good night",
    message:
      "i think about how our whole relationship kind of runs on two messages a day. good morning from whoever wakes up first, good night from whoever's still up last. everything else in between is a bonus, but those two are the ones i'd protect the most if i had to choose.\n\nthere's something about knowing the very first thing on your mind when you wake up includes me, even a little. and something about being the last thing you check before you close your eyes. it's such a small ritual, barely a sentence most days, but it's the frame that holds the rest of the day together for me.\n\ni notice when the good morning is later than usual. i notice when the good night comes with extra detail because something happened that day that you wanted to tell me about before sleeping on it. i notice all of it, because as small as those two messages are, they're actually the biggest thing. they're proof, every single day, that no matter what else is going on, you still made room for me first and last.\n\nkeep sending them. i'll keep waiting for them, happily, for as long as you'll have me.",
  },
  {
    from: "one of the moments",
    message:
      "people always ask if there was one moment that made it click, like a single thing i could point to and say, there, that's when it happened. i don't think there's just one. it built up in pieces, small ordinary moments that on their own didn't mean much but somehow added up to something big.\n\nbut there's one i keep coming back to. we were talking about your plushies, you going through which ones you'd bring with you if you could bring all of them somewhere, and i just said, half joking, that i'd build you a tent someday. a proper one, soft and stupid and covered in blankets, somewhere we could just lay around with all your plushies and have our dates in it. no real reason, just because it sounded like something you'd like.\n\nit wasn't a big moment. you probably don't even remember it the way i do. but i remember exactly where i was sitting when i said it, and i remember meaning it, not as a joke but as an actual plan i wanted to keep somewhere in my head for later. that's the part that got me. i wasn't picturing some big future, i was picturing a tent full of blankets and stuffed animals with you in it, and it felt like the most obvious thing in the world to want.\n\ni've had bigger, more dramatic feelings before that one. but that's the one that stuck, probably because it wasn't really about a feeling at all. it was just a small, specific plan i made without meaning to, and i still want to build you that tent someday.\n\nso when people ask if there was a moment, i think about the tent.",
  },
  {
    from: "still here",
    message:
      "i wanted to write one that isn't about a memory or a specific feeling, just one that says where we're at right now, plainly, without dressing it up too much.\n\nwe're still here. still doing the distance, still doing the time difference math, still choosing this every single day even though it would honestly be easier not to sometimes. i think that's worth writing down. not the big declarations, just the fact that we keep showing up.\n\ni'm not going anywhere. i know that's an easy thing to say and a harder thing to prove from far away, but i mean it as plainly as i can. every version of the future i think about has you in it, not as an afterthought, just as a given.\n\nso this letter isn't a big one. it's just a small, steady one. still here. still yours. still choosing this, today and probably every day after it too.",
  },
];

const ENVELOPE_COLORS = [
  "from-pink-200 to-rose-200",
  "from-purple-200 to-pink-200",
  "from-rose-200 to-orange-200",
  "from-fuchsia-200 to-rose-200",
  "from-pink-300 to-purple-200",
  "from-orange-200 to-pink-200",
  "from-rose-300 to-pink-200",
  "from-purple-300 to-fuchsia-200",
];

const PASSCODE = "1007";

const SealedLetters = ({ onNext }: Props) => {
  const [opened, setOpened]   = useState<Set<number>>(new Set());
  const [reading, setReading] = useState<number | null>(null);

  const [unlocked, setUnlocked]         = useState(false);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [code, setCode]                 = useState("");
  const [wrong, setWrong]               = useState(0);

  const openLetter = (i: number) => {
    setOpened((prev) => new Set([...prev, i]));
    setReading(i);
  };

  const handleEnvelopeClick = (i: number) => {
    if (unlocked) {
      openLetter(i);
      return;
    }
    setPendingIndex(i);
    setCode("");
    setWrong(0);
  };

  const submitCode = () => {
    if (code === PASSCODE) {
      setUnlocked(true);
      const target = pendingIndex;
      setPendingIndex(null);
      setCode("");
      if (target !== null) openLetter(target);
    } else {
      setWrong((w) => w + 1);
      setCode("");
    }
  };

  const allOpened = opened.size === LETTERS.length;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10 relative overflow-hidden">
      <FallingCharacters variant="rinini" />

      <div className="z-10 w-full max-w-lg flex flex-col items-center gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-love-deep mb-1">
            letters for you 💌
          </h2>
          <p className="text-muted-foreground text-sm">
            {opened.size} / {LETTERS.length} opened
          </p>
        </motion.div>

        {/* Envelope grid */}
        <div className="grid grid-cols-4 gap-3 w-full">
          {LETTERS.map((_, i) => {
            const isOpen = opened.has(i);
            const color  = ENVELOPE_COLORS[i % ENVELOPE_COLORS.length];
            return (
              <motion.button
                key={i}
                whileHover={{ scale: isOpen ? 1 : 1.08, y: isOpen ? 0 : -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEnvelopeClick(i)}
                className={`aspect-[3/2] rounded-2xl bg-gradient-to-br ${color} shadow-md border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all ${
                  isOpen ? "opacity-70 border-love-rose/60" : "border-transparent cursor-pointer"
                }`}
              >
                {/* Envelope flap line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1/2 border-b-2 border-white/40"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    background: "rgba(255,255,255,0.25)",
                  }}
                />

                <span className="text-2xl relative z-10">
                  {isOpen ? "💌" : "✉️"}
                </span>

                {isOpen && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-xs text-white font-bold"
                  >
                    ✓
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Next button */}
        <AnimatePresence>
          {allOpened && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNext}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg text-base"
            >
              next →
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Passcode modal */}
      <AnimatePresence>
        {pendingIndex !== null && !unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={() => setPendingIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl p-10 shadow-2xl border border-border flex flex-col items-center gap-5 w-full max-w-sm"
            >
              <div className="text-5xl">🔒</div>
              <h3 className="text-xl font-bold text-love-deep text-center">
                enter the code
              </h3>
              <p className="text-muted-foreground text-sm text-center">
                you'll know it
              </p>

              <motion.input
                key={wrong}
                animate={wrong > 0 ? { x: [0, -8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
                type="tel"
                inputMode="numeric"
                maxLength={4}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && submitCode()}
                placeholder="••••"
                autoFocus
                className="w-40 bg-background border border-input rounded-2xl px-4 py-3 text-3xl tracking-[0.5em] text-center focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {wrong > 0 && (
                <p className="text-love-rose text-sm">not quite — try again</p>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={submitCode}
                disabled={code.length < 4}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg text-base w-full disabled:opacity-40"
              >
                unlock
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter reading modal */}
      <AnimatePresence>
        {reading !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={() => setReading(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl p-8 shadow-2xl border border-border max-w-md w-full max-h-[80vh] overflow-y-auto flex flex-col items-center gap-4"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              <div className="text-4xl">💌</div>
              <h3 className="text-lg font-bold text-love-deep text-center">
                {LETTERS[reading].from}
              </h3>
              <p className="text-foreground text-base leading-relaxed text-left italic whitespace-pre-line">
                {LETTERS[reading].message}
              </p>
              <button
                onClick={() => setReading(null)}
                className="mt-2 text-muted-foreground text-sm hover:text-foreground transition-colors"
              >
                close ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SealedLetters;
