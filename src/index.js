import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



/*The DOM <button> element’s onClick attribute has a special meaning to React
because it is a built-in component.*/

/*It's best to use on[Event] names for props(properties) for props which 
represent events and handle[Event] for the methods which handle the events.
You can give any name to the Square’s onClick prop or Board’s handleClick 
method, and the code would work the same.*/

class Square extends React.Component {

    render() {
        return (
            /*The onClick prop on the built-in DOM <button> component tells React to set up a click event listener.
When the button is clicked, React will call the onClick event handler that is defined in Square’s render() method.
This event handler calls this.props.onClick(). The Square’s onClick prop was specified by the Board.
Since the Board passed onClick={() => this.handleClick(i)} to Square, the Square calls this.handleClick(i) when clicked.
*/
            <button
                className="square"
                onClick={() => { this.props.onClick({ value: 'X' }) }}
            >

                {this.props.value}
            </button>
        );
    }
}
class Board extends React.Component {
    /*In JavaScript classes, you need to always call super when defining the constructor of a subclass. All React component 
    classes that have a constructor should start with a super(props) call.*/

    //the constructor will keep track of the game's state
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
        }
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        squares[i] = 'X';
        this.setState({ squares: squares });
    }

    /*these are what is being passed down to sqaure*/
    renderSquare(i) {
        return <Square value={this.state.squares[i]}
            onClick={() => this.handleClick(i)} />;
    }

    render() {
        const status = 'Next player: X';

        return (
            <div>
                <div className="status">{status}</div>
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
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
