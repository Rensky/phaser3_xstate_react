import { useState, useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { Machine, interpret, assign } from 'xstate'

// 定義一個狀態機
const counterMachine = Machine({
	id: 'counter',
	initial: 'active',
	context: { count: 0 },
	states: {
		active: {
			on: {
				INCREMENT: {
					actions: assign({ count: (context) => context.count + 1 }),
				},
				DECREMENT: {
					actions: assign({ count: (context) => context.count - 1 }),
				},
				STOP: 'stopped',
			},
		},
		stopped: {
			on: {
				RESTART: 'active',
			},
		},
	},
})

const counterService = interpret(counterMachine).start()

function Game({ count }) {
	const textRef = useRef()

	useEffect(() => {
		const config = {
			type: Phaser.AUTO,
			width: 800,
			height: 600,
			scene: {
				create: create,
			},
		}

		const game = new Phaser.Game(config)

		function create() {
			textRef.current = this.add.text(400, 300, `Count: ${count}`, { fontSize: '64px', fill: '#fff' })
		}

		return () => {
			game.destroy(true)
		}
	}, [])

	useEffect(() => {
		if (textRef.current) {
			textRef.current.setText(`Count: ${count}`)
		}
	}, [count])

	return <div id="phaser-game"></div>
}

function App() {
	const [count, setCount] = useState(0)
	useEffect(() => {
		const subscription = counterService.subscribe((state) => {
			setCount(state.context.count)
		})

		return () => subscription.unsubscribe()
	}, [])

	return (
		<>
			<Game count={count} />
			<button onClick={() => counterService.send('INCREMENT')}>Increment</button>
			<button onClick={() => counterService.send('DECREMENT')}>Decrement</button>
			<button onClick={() => counterService.send('STOP')}>Stop</button>
			<button onClick={() => counterService.send('RESTART')}>Restart</button>
		</>
	)
}

export default App
