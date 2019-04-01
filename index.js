class Square extends React.Component {
  render() {
    return (
      <button 
        className="square"
        onClick={() => this.props.onClick()}
      >
	    {this.props.highlight? <b><i> {this.props.value} </i></b>: this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i, highlight) {
    return <Square	
             key={'Square' + i}
             value={this.props.squares[i]}
			       highlight={highlight}
             onClick={() => this.props.onClick(i)} 
           />;
  }
  
  renderSquareLoop(row, col){
    let divRow = [];
    for (let i = 0; i < row; i++){
      let squareCol = [];
      for (let j = 0; j < col; j++){
		    let index = i * col + j;  
        squareCol.push(this.renderSquare(index, this.props.highlights.includes(index)));
      }
      divRow.push(React.createElement('div',
                                      {key: 'row' + i, className: 'board-row'},
                                      squareCol,
                                     )
                 );
    }
    return React.createElement('div', {}, divRow);
  }

  render() {
    return (
      this.renderSquareLoop(3, 3)
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: null
        }
      ],
      xIsNext: true,
      stepNumber: 0,
    };
  }
  
  jumpTo(step){
    this.setState({
      xIsNext: step % 2 == 0,
      stepNumber: step
    });
  }
  
  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winner || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: {row: parseInt(i / 3), col: i % 3}
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
	  const calculateResult = calculateWinner(current.squares);
    const winner = calculateResult.winner;
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const desc2 = move ?
        'Row: ' + step.location.row + ' Col: ' + step.location.col:
        '';
      return (
        <li key={move}>
          {move == this.state.stepNumber? <b> {desc2} </b>: desc2}
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    
    let status;
    if (winner){
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext? 'X' : 'O');
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            highlights={calculateResult.highlights} 		  
            squares={current.squares}
            xIsNext={this.state.xIsNext}
            onClick={(i) => {this.handleClick(i)}}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let result = {
    winner: null,
    highlights: [],
  };
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      result.winner = squares[a];
      result.highlights = lines[i];
      break;
    }
  }
  return result;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);