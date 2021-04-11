import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



//This Square component is known as 'Controlled components'. Board has control over each one
//If a component only contains a render method and doesn't have an individual state then
//make it a function component instead of a class.
function Square(props) {

    return (
        /*The onClick prop on the built-in DOM <button> component tells React to set up a click event listener.
When the button is clicked, React will call the onClick event handler that is defined in Square’s render() method.
This event handler calls this.props.onClick(). The Square’s onClick prop was specified by the Board.
Since the Board passed onClick={() => this.handleClick(i)} to Square, the Square calls this.handleClick(i) when clicked.
*/
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}



class Board extends React.Component {

    /*these are what is being passed down to sqaure*/
    renderSquare(i) {
        return <Square value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)} />;
    }

    render() {

        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    /*In JavaScript classes, you need to always call super when defining the constructor of a subclass. All React component 
    classes that have a constructor should start with a super(props) call.*/

    //the constructor will keep track of the game's state
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i) {
        //This ensures that if we “go back in time” and then make a new move from that point, we throw away all the “future” history that would now become incorrect.
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        //.slice() creates a copy of the squares array to modify rather than the existing. This is for Immutatability see bottom.
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            //concat is used instead of push because it doesn't mutate the orignal array
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    //xIsNext is true if the number stepNumber is changing to is even
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);


        //for each move a list button is created.  button has a onClick handler which calls a method called this.jumpTo()
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                //having a key id is important. moves are never re-ordered, deleted, or inserted in the middle, so it’s safe to use the move index as a key
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }



        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
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


/* checks through the array of lines to see if all 3 positions have all Xs or all Os*/
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);







//NOTES======================================================================

/*The DOM <button> element’s onClick attribute has a special meaning to React
because it is a built-in component.*/

/*It's best to use on[Event] names for props(properties) for props which
represent events and handle[Event] for the methods which handle the events.
You can give any name to the Square’s onClick prop or Board’s handleClick
method, and the code would work the same.*/




//IMPORTANCE OF IMMUTATABILITY
/* Avoiding direct data mutation lets us keep previous versions of the game’s
history intact, and reuse them later.

Detecting changes in mutable objects is difficult because they are modified directly.
This detection requires the mutable object to be compared to previous copies
of itself. Detecting changes in immutable objects is considerably easier.
If the immutable object that is being referenced is different than the
previous one, then the object has changed.

The main benefit of immutability is that it helps you build pure components in React.
Immutable data can easily determine if changes have been made, which helps to determine
when a component requires re-rendering. */

