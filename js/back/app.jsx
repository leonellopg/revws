// @flow
import React from 'react';
import type { GoTo, RoutingState, GlobalDataType } from 'back/types';
import Snackbar from 'back/pages/snackbar';
import styles from './app.less';
import AppTheme from 'common/components/theme/theme';
import { getRoutingState } from 'back/selectors/routing-state';
import { isNewVersionAvailable } from 'back/selectors/account';
import { render } from 'back/routing';
import { connect } from 'react-redux';
import { mapObject } from 'common/utils/redux';
import { goTo } from 'back/actions/creators';
import Navigation from 'back/components/navigation/navigation';
import Registration from 'back/components/registration';

type Props = {
  routingState: RoutingState,
  newVersionAvailable: boolean,
  goTo: GoTo,
  data: GlobalDataType
};

class BackApp extends React.PureComponent<Props> {
  static displayName = 'BackApp';

  render() {
    const { data, newVersionAvailable, routingState, goTo } = this.props;
    const snackbarPosition = { vertical: 'bottom', horizontal: 'right' };
    return (
      <AppTheme>
        <div className={styles.app}>
          { this.renderNavigation(routingState, newVersionAvailable) }
          { render(routingState, { ...routingState, data, goTo }) }
          <Snackbar anchorOrigin={snackbarPosition} />
          <Registration />
        </div>
      </AppTheme>
    );
  }

  renderNavigation = (routingState: RoutingState, newVersionAvailable: boolean) => {
    if (routingState.showNavigation) {
      const warnings = this.props.data.warnings;
      return (
        <Navigation
          newVersionAvailable={newVersionAvailable}
          routingState={routingState}
          warnings={warnings ? warnings.length : 0}
          goTo={this.props.goTo}
        />
      );
    }
  }
}

const mapStateToProps = mapObject({
  routingState: getRoutingState,
  newVersionAvailable: isNewVersionAvailable
});

const actions = { goTo };

const connectRedux = connect(mapStateToProps, actions);
const Connected = connectRedux(BackApp);

export default Connected;
