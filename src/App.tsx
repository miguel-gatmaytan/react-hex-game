import { useEffect, useState, useRef } from "react";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";

const HEX_VALS = [1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];

const randHexVal = () => {
	return HEX_VALS[Math.floor(Math.random() * HEX_VALS.length)];
};

const generateHex = () => {
	let hex = "#";
	while (hex.length < 7) hex += randHexVal();
	return hex;
};

function App() {
	const { width, height } = useWindowSize();

	const [score, setScore] = useState(0);
	const [answer, setAnswer] = useState(0);
	const [batch, setBatch] = useState<string[]>([]);
	const [correct, setCorrect] = useState<boolean | null>(null);
	const [wrongGuesses, setWrongGuesses] = useState<number[]>([]);
	const timeout = useRef<any>(null);

	const makeBatch = () => {
		const newBatch = [];
		while (newBatch.length < 3) newBatch.push(generateHex());
		setBatch(newBatch);
	};

	const reset = () => {
		makeBatch();
		setAnswer(Math.floor(Math.random() * 3));
		setCorrect(null);
		setWrongGuesses([]);
		timeout.current = null;
	};

	const checkAnswer = (num: number) => {
		if (timeout.current !== null) return;
		const isCorrect = num === answer;
		setCorrect(isCorrect);
		setScore((score) => (isCorrect ? score + 1 : score - 1));
		if (isCorrect) timeout.current = setTimeout(reset, 2500);
		else setWrongGuesses((wrongGuesses) => [...wrongGuesses, num]);
	};

	const button = (val: string, num: number) => {
		const isWrong = wrongGuesses.includes(num);
		const isCorrect = num === answer && timeout.current;
		return (
			<button
				className={`h-full w-full md:w-24 border-2 p-2  ${
					isWrong
						? "bg-red-100"
						: isCorrect
						? "bg-green-100"
						: "hover:bg-gray-100 active:bg-gray-200 disabled:bg-white"
				}`}
				onClick={() => checkAnswer(num)}
				disabled={isWrong || timeout.current}
			>
				{val}
			</button>
		);
	};

	useEffect(() => {
		reset();
	}, []);

	return (
		<>
			{correct && (
				<Confetti width={width} height={height} recycle={false} gravity={0.2} />
			)}
			<div className="flex justify-center items-center w-screen h-screen">
				<div className="flex-col">
					<h1 className="text-4xl text-center m-6">guess the hex</h1>
					<div className="text-center mb-2 md:mb-10">
						<h1 className="text-xl">Score: {score}</h1>
					</div>
					<div
						className="w-64 h-64 md:w-96 md:h-96 transition-colors"
						style={{ backgroundColor: batch[answer] }}
					/>
					<div className="flex flex-col md:flex-row w-64 md:w-96 md:h-24 justify-between mt-10">
						{batch.map((hex, i) => button(hex, i))}
					</div>
					<div className="flex justify-center items-end h-12">
						{correct && <h3 className="text-green-300">Correct!</h3>}
						{correct === false && (
							<h3 className="text-red-500">Incorrect. Guess Again.</h3>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
