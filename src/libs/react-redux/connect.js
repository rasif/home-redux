import React from 'react';
import {Consumer} from './context';

function connect(mapStateToProps, mapStateToDispatch) {
	return Component => {
		class ConnectedComponent extends React.Component {
			constructor(props) {
				super(props);

				this.state = {};
			}

			componentDidMount() {
				this.props.store.subscribe(store => {
					this.setState({store});
				});
			}

			render() {
				const stateToProps =
					typeof mapStateToProps === 'function' ? mapStateToProps(this.props.store.getState()) : {};
				const stateToDispatch =
					typeof mapStateToDispatch === 'function' ? mapStateToDispatch(this.props.store.dispatch) : {};

				return <Component {...this.props} {...stateToProps} {...stateToDispatch} />;
			}
		}

		return props => {
			return <Consumer>{store => <ConnectedComponent {...props} store={store} />}</Consumer>;
		};
	};
}

export default connect;
