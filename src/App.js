import connect from './libs/react-redux/connect';

function App({count, increase}) {
	return (
		<>
			<p onClick={increase}>Count: {count}</p>
		</>
	);
}

function mapStateToProps(state) {
	return {
		count: state.counter.count
	};
}

function mapStateToDispatch(dispatch) {
	return {
		increase: () => dispatch({type: 'increase'})
	};
}

export default connect(mapStateToProps, mapStateToDispatch)(App);
