{{- define "hmpps-prisoner-pay-ui.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "hmpps-prisoner-pay-ui.envoyDeploymentName" -}}
{{- .Values.envoy.deploymentName -}}
{{- end -}}

{{- define "hmpps-prisoner-pay-ui.envoyConfigMapName" -}}
{{- .Values.envoy.configMapName -}}
{{- end -}}

{{- define "hmpps-prisoner-pay-ui.envoyServiceName" -}}
{{- .Values.envoy.serviceName -}}
{{- end -}}

{{- define "hmpps-prisoner-pay-ui.envoyLabels" -}}
app: {{ include "hmpps-prisoner-pay-ui.envoyDeploymentName" . }}
app.kubernetes.io/name: {{ include "hmpps-prisoner-pay-ui.envoyDeploymentName" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: proxy
app.kubernetes.io/managed-by: {{ .Release.Service }}
helm.sh/chart: {{ include "hmpps-prisoner-pay-ui.chart" . }}
{{- end -}}

{{- define "hmpps-prisoner-pay-ui.hostFromUrl" -}}
{{- $url := . | toString -}}
{{- $withScheme := regexFind "https?://[^/]+" $url -}}
{{- if $withScheme -}}
{{- trimPrefix "https://" (trimPrefix "http://" $withScheme) -}}
{{- else -}}
{{- $url -}}
{{- end -}}
{{- end -}}

{{- define "hmpps-prisoner-pay-ui.envoyRbacPermissions" -}}
{{- $permissions := list -}}
{{- range .Values.envoy.allowedHosts.exact }}
{{- if . }}
{{- $permissions = append $permissions (dict "header" (dict "name" ":authority" "string_match" (dict "exact" .))) -}}
{{- $permissions = append $permissions (dict "header" (dict "name" ":authority" "string_match" (dict "exact" (printf "%s:443" .)))) -}}
{{- end -}}
{{- end -}}
{{- range .Values.envoy.allowedHosts.suffixes }}
{{- if . }}
{{- $permissions = append $permissions (dict "header" (dict "name" ":authority" "string_match" (dict "suffix" .))) -}}
{{- $permissions = append $permissions (dict "header" (dict "name" ":authority" "string_match" (dict "suffix" (printf "%s:443" .)))) -}}
{{- end -}}
{{- end -}}
{{- $env := index .Values "generic-service" "env" -}}
{{- range $key := .Values.envoy.allowedHostEnvVars }}
{{- $url := index $env $key -}}
{{- if $url }}
{{- $host := include "hmpps-prisoner-pay-ui.hostFromUrl" $url -}}
{{- $permissions = append $permissions (dict "header" (dict "name" ":authority" "string_match" (dict "exact" $host))) -}}
{{- $permissions = append $permissions (dict "header" (dict "name" ":authority" "string_match" (dict "exact" (printf "%s:443" $host)))) -}}
{{- end -}}
{{- end -}}
{{ toYaml $permissions }}
{{- end -}}