defmodule Memory.Game do
  def new do
    letters = Enum.shuffle(["A", "B", "C", "D", "E", "F", "G", "H", "A", "B", "C", "D", "E", "F", "G", "H"])
    %{
    board: letters,
    guesses: [],
    matches: ["E", "A"],
    clicks: 0,
    }
  end

  def client_view(game) do
    board = skeleton(game.board, game.matches)
    IO.inspect(board);
    %{
        board: board,
        guesses: game.guesses,
        clicks: game.clicks,
    }
end

def skeleton(board, matches) do
    skel = Enum.map board, fn letter ->
      if Enum.member?(matches, letter) do
          %{letter: letter, flipped: false}
      else
          %{letter: "-", flipped: false}
      end
    end
end

  def guess(state = %{board: letters, guesses: [ {num, letter} | []], matches: mlist, clicks: numClicks}, index) do
    isAMatch = Enum.at(letters, index) == Enum.at(letters, num)
    match_or_flip(state, index, isAMatch)
end

def match_or_flip(state, index, true) do
    newMatch = [Enum.at(state.board, index)]
    %{board: state.board, guesses: [], matches: state.matches ++ newMatch, clicks: state.clicks}
end

def match_or_flip(state, index, false) do
    %{board: state.board, guesses: state.guesses ++ [{index, Enum.at(state.board, index)}], matches: state.matches, clicks: state.clicks}
end

def guess(state = %{board: letters, guesses: [], matches: mlist, clicks: numClicks}, index) do
    newState = state
    letterGuessed = Enum.at(state.board, index)
    gs = newState.guesses ++ [{index, letterGuessed}]
    Map.put(newState, :guesses, gs)
    Map.put(newState, :clicks, numClicks + 1)
    newState
end

  def restart(game) do
    new()
  end
end
