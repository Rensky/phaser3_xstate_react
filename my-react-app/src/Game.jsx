import { useEffect, useRef } from 'react'
import Phaser from 'phaser'

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

		new Phaser.Game(config)

		function create() {
			textRef.current = this.add.text(400, 300, `Count: ${count}`, { fontSize: '64px', fill: '#000' })
		}
	}, [])

	useEffect(() => {
		if (textRef.current) {
			textRef.current.setText(`Count: ${count}`)
		}
	}, [count])

	return <div id="phaser-game"></div>
}

export default Game
