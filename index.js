const React = require('react-native');
const {
  PixelRatio,
  StatusBarIOS,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} = React;

const NAV_BAR_HEIGHT = 44;
const STATUS_BAR_HEIGHT = 20;
const NAV_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT;

const styles = StyleSheet.create({
  navBarContainer: {
    height: NAV_HEIGHT,
    backgroundColor: 'white',
    paddingBottom: 5,
    borderBottomColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomWidth: 1 / PixelRatio.get(),
  },
  navBar: {
    height: NAV_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  customTitle: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 5,
    left: 0,
    right: 0,
  },
  navBarText: {
    fontSize: 17,
    marginVertical: 10,
    flex: 2,
    textAlign: 'center',
  },
  navBarTitleText: {
    color: '#373e4d',
    fontWeight: '500',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
  },
  navBarLeftButton: {
    paddingLeft: 8,
  },
  navBarRightButton: {
    paddingRight: 8,
  },
  navBarButtonText: {
    color: '#5890ff',
  },
});

const NavigationBar = React.createClass({

  propTypes: {
    navigator: React.PropTypes.object,
    route: React.PropTypes.object,
  },

  /*
   * If there are no routes in the stack, `hidePrev` isn't provided or false,
   * and we haven't received `onPrev` click handler, return true
   */
  prevButtonShouldBeHidden() {
    const {
      onPrev,
      hidePrev,
      navigator
    } = this.props;

    const getCurrentRoutes = navigator.getCurrentRoutes;

    return (
      hidePrev ||
      (getCurrentRoutes && getCurrentRoutes().length <= 1 && !onPrev)
    );
  },

  /**
   * Describes how we get a left button in the navbar
   */
  getLeftButtonElement() {
    const {
      onPrev,
      prevTitle,
      navigator,
      route,
      buttonsColor,
      customPrev,
    } = this.props;

    /*
     * If we have a `customPrev` component, then return
     * it's clone with additional attributes
     */
    if (customPrev) {
      return React.cloneElement(customPrev, { navigator, route, });
    }

    /*
     * Check if we need to hide `prev` button
     */
    if (this.prevButtonShouldBeHidden()) {
      return <View style={styles.navBarLeftButton}></View>;
    }

    /*
     * Apply custom background styles to button
     */
    const customStyle = buttonsColor ? { color: buttonsColor, } : {};

    /*
     * holds a ref to onPress which either be navigator.pop or a handler
     */
    var onPress = navigator.pop;

    if (onPrev) {
      //we are passing navigator and route to onPrev handler
      onPress = () => onPrev(navigator, route);
    }

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.navBarLeftButton}>
          <Text style={[styles.navBarText, styles.navBarButtonText, customStyle, ]}>
            {prevTitle || 'Back'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  /*
   * Describe how we get a title for the navbar
   */
  getTitleElement() {
    const {
      title,
      titleColor,
      customTitle,
      navigator,
      route,
    } = this.props;

    /*
     * Return `customTitle` component if we have it
     */
    if (customTitle) {
      return (
        <View style={styles.customTitle}>
          {React.cloneElement(customTitle, { navigator, route })}
        </View>
      );
    }

    if (title && !title.length) {
      return true;
    }

    const titleStyle = [
      styles.navBarText,
      styles.navBarTitleText,
      { color: titleColor, },
    ];

    return (
      <Text style={titleStyle}>
        {title}
      </Text>
    );
  },

  getRightButtonElement() {
    const {
      onNext,
      nextTitle,
      navigator,
      route,
      buttonsColor,
      customNext
    } = this.props;

    /*
     * If we have a `customNext` component, then return
     * it's clone with additional attributes
     */
    if (customNext) {
      return React.cloneElement(customNext, { navigator, route, });
    }

    /*
     * If we haven't received `onNext` handler, then just return
     * a placeholder for button to keep markup consistant and
     * title aligned to the center
     */
    if (!onNext) {
      return <Text style={styles.navBarRightButton}></Text>;
    }

    /*
     * Apply custom background styles to button
     */
    const customStyle = buttonsColor ? { color: buttonsColor, } : {};

    return (
      <TouchableOpacity onPress={() => onNext(navigator, route)}>
        <View style={styles.navBarRightButton}>
          <Text style={[styles.navBarText, styles.navBarButtonText, customStyle]}>
            {nextTitle || 'Next'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  render() {
    if (this.props.statusBar === 'lightContent') {
      StatusBarIOS.setStyle('light-content', false);
    } else if (this.props.statusBar === 'default') {
      StatusBarIOS.setStyle('default', false);
    }

    const { style, backgroundStyle } = this.props;

    return (
      <View style={[styles.navBarContainer, backgroundStyle, ]}>
        <View style={[styles.navBar, style, ]}>
          {this.getTitleElement()}
          {this.getLeftButtonElement()}
          {this.getRightButtonElement()}
        </View>
      </View>
    );
  },
});

module.exports = NavigationBar;
