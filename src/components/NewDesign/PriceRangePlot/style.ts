import { makeStyles } from '@material-ui/core/styles'
import { colors, theme } from '@static/theme'

const useStyles = makeStyles(() => ({
  container: {
    height: '100%',
    position: 'relative',
    '& g > text': {
      stroke: 'none',
      fill: '#746E7C!important',
      fontFamily: 'Mukta!important',
      [theme.breakpoints.down('sm')]: {
        fontSize: '8px!important'
      }
    }
  },
  zoomIcon: {
    width: 14,
    height: 'auto',
    fill: '#000000'
  },
  zoomButton: {
    minWidth: 0,
    width: 21,
    height: 18,
    backgroundColor: colors.invariantV2.green2,
    borderRadius: 3,
    padding: 0
  },
  zoomButtonsWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
    maxWidth: 21,
    height: 42,
    zIndex: 10
  }
}))

export default useStyles
