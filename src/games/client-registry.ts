"use client";

import type { ComponentType } from "react";
import type { GameComponentProps } from "@/games/types";
import { WordleGame } from "@/games/wordle/WordleGame";
import { DingbatsGame } from "@/games/dingbats/DingbatsGame";
import { Perfect10Game } from "@/games/perfect10/Perfect10Game";
import { BotOrNotGame } from "@/games/botOrNot/BotOrNotGame";

export const GAME_COMPONENTS: Record<string, ComponentType<GameComponentProps>> = {
  wordle: WordleGame,
  dingbats: DingbatsGame,
  perfect10: Perfect10Game,
  botOrNot: BotOrNotGame,
};
