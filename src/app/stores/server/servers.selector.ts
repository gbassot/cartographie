import { createSelector } from '@ngrx/store'
import { Link, Scenario, Server, Step } from 'src/app/models/documentation.model'
import { DocumentationState } from '../documentation.state'
import { selectActiveScenariosOrAllScenarios } from '../scenario/scenario.selector'
import { ServerState } from './server.state'

export const selectServers = (state: DocumentationState) => state.servers

export const selectAllServers = createSelector(
  selectServers,
  (state: ServerState) => state.servers
)

export const selectAllActiveServers = createSelector(
  selectAllServers,
  selectActiveScenariosOrAllScenarios,
  (servers: Server[], scenarios: Scenario[]) => {
    return servers.filter((server: Server) => scenarios.find((scenario: Scenario) => (
      scenario.steps.find((step: Step) => step.server === server.key) ||
      scenario.steps.find((step: Step) => step.request?.target === server.key) ||
      scenario.steps.find((step: Step) => step.response?.target === server.key)
    )))
  }
)

export const getLinks = createSelector(
  selectAllActiveServers,
  selectActiveScenariosOrAllScenarios,
  (servers: Server[], scenarios: Scenario[]) => {
    const links: Link[] = []
    scenarios.forEach((scenario: Scenario) => {
      scenario.steps.filter((step: Step) => step.request).forEach((step: Step) => {
        const from = servers.find((server: Server) => server.key === step.server)
        const to = servers.find((server: Server) => server.key === step.request.target)
        const link: Link = {
          from: from,
          to: to
        }
        if (from && to && !links.find((l: Link) => l.from.key === link.from.key && l.to.key === link.to.key)) {
          links.push(link)
        }
      })
    })
    return links
  }
)
