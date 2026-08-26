# Telemetry Error Log

## Error 1: `write_to_file` ArtifactMetadata Target Path Mismatch
- **Timestamp:** 2026-08-26T23:29:12+05:30
- **Description:** Invoked `write_to_file` with `ArtifactMetadata` populated while `TargetFile` pointed to a workspace path (`c:\Web_template\spec\...`) instead of the artifact directory `<appDataDir>\brain\<conversation-id>`. The tool threw an invalid argument error: `TargetFile is not a valid artifact path; artifacts must be in C:\Users\Pratik\.gemini\antigravity\brain\<conversation-id>/`.
- **Root Cause:** Supplying `ArtifactMetadata` flags the file as an artifact, requiring the destination path to reside strictly within the agent's brain artifact directory. Workspace files must omit `ArtifactMetadata`.
- **Remediation:** Do not include `ArtifactMetadata` when writing project/workspace files. Only include `ArtifactMetadata` when creating markdown artifacts inside the designated conversation brain artifact directory.
