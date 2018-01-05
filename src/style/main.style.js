import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flex: 1,
    backgroundColor: 'powderblue',
    flexDirection: 'row',
  },
  main: {
    flex: 6,
    backgroundColor: 'skyblue',
  },
  footer: {
    flex: 1,
    backgroundColor: 'steelblue',
    flexDirection: 'row',
  },
  userList: {
    flex: 3,
    flexDirection: 'column',
    backgroundColor: 'skyblue',
  },
  gridRow: {
    flex: 1,
    backgroundColor: 'skyblue',
    flexDirection: 'row',
  },
  gridColumn: {
    flex: 1,
    backgroundColor: 'skyblue',
    flexDirection: 'column',
  },
  block: {
    flex: 1,
  },
  alignCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: 'navy',
    fontSize: 36,
  },
  playerText: {
    color: 'navy',
    fontSize: 12,
  },
  footerText: {
    color: 'white',
    fontSize: 36,
  },
  playerTextInput: {
    margin: 24,
    fontSize: 28,
    borderRadius: 12,
    backgroundColor: 'steelblue',
    paddingLeft: 24,
    paddingRight: 24,
  },
  chatTextInput: {
    margin: 24,
    fontSize: 28,
    borderRadius: 12,
    backgroundColor: 'white',
    paddingLeft: 12,
    paddingRight: 12,
  },
  startButton: {
    height: 36,
    backgroundColor: 'white',
    flex: 2,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 24,
  },
  button: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 10,    
    borderRadius: 12,
    alignItems: 'center'
  },
  meText: {
    backgroundColor: 'pink',
    padding: 10,
    margin: 10,    
    borderRadius: 12,
    alignItems: 'center',
    flex: 1
  },
  youText: {
    backgroundColor: 'white',
    padding: 10,
    margin: 10,    
    borderRadius: 12,
    alignItems: 'center',
    flex: 1
  }
});

module.exports = styles;
