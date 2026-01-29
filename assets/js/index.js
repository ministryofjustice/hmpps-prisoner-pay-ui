import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import * as payFrontend from './all'

govukFrontend.initAll()
mojFrontend.initAll()
payFrontend.initAll()

export default {
  ...payFrontend,
}