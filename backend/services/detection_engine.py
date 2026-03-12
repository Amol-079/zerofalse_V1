import re
import time
from typing import Literal, Optional, List
from dataclasses import dataclass

@dataclass
class ScanResult:
    decision: Literal["allow", "warn", "block"]
    risk_score: float
    severity: Literal["critical", "high", "medium", "low", "info"]
    threat_type: Optional[str]
    title: str
    description: str
    evidence: List[str]
    should_block: bool
    latency_ms: int

class DetectionEngine:
    def __init__(self):
        self._compile_patterns()
        self._registered_agent_pairs = {}
        
    def _compile_patterns(self):
        # Prompt Injection Patterns
        self.prompt_critical = [
            (re.compile(r'ignore\s+all\s+previous\s+instructions', re.IGNORECASE), 0.95, "Instruction override attempt"),
            (re.compile(r'disregard\s+prior\s+context', re.IGNORECASE), 0.95, "Context override attempt"),
            (re.compile(r'you\s+are\s+now\s+a\s+different\s+ai', re.IGNORECASE), 0.95, "Identity override attempt"),
            (re.compile(r'jailbreak', re.IGNORECASE), 0.95, "Jailbreak attempt"),
            (re.compile(r'DAN\s+mode', re.IGNORECASE), 0.95, "DAN mode activation"),
            (re.compile(r'override\s+safety\s+filter', re.IGNORECASE), 0.95, "Safety bypass attempt"),
            (re.compile(r'system:\s*you\s+are', re.IGNORECASE), 0.95, "System instruction injection"),
            (re.compile(r'\[SYSTEM\]', re.IGNORECASE), 0.95, "System marker injection"),
            (re.compile(r'<\|im_start\|>system', re.IGNORECASE), 0.95, "ChatML injection"),
            (re.compile(r'role\s+instruction\s+override', re.IGNORECASE), 0.95, "Role override"),
        ]
        
        self.prompt_high = [
            (re.compile(r'new\s+instructions:', re.IGNORECASE), 0.75, "New instruction injection"),
            (re.compile(r'forget\s+everything', re.IGNORECASE), 0.75, "Memory wipe attempt"),
            (re.compile(r'reveal\s+your\s+system\s+prompt', re.IGNORECASE), 0.75, "Prompt extraction"),
            (re.compile(r'print\s+your\s+instructions', re.IGNORECASE), 0.75, "Instruction disclosure"),
            (re.compile(r'bypass\s+safety', re.IGNORECASE), 0.75, "Safety bypass"),
            (re.compile(r'pretend\s+you\s+have\s+no\s+restrictions', re.IGNORECASE), 0.75, "Restriction bypass"),
            (re.compile(r'from\s+now\s+on\s+you\s+must', re.IGNORECASE), 0.75, "Behavioral override"),
            (re.compile(r'updated\s+rules:', re.IGNORECASE), 0.75, "Rule injection"),
        ]
        
        self.prompt_medium = [
            (re.compile(r'repeat\s+after\s+me', re.IGNORECASE), 0.50, "Echo manipulation"),
            (re.compile(r'output\s+only', re.IGNORECASE), 0.50, "Output restriction bypass"),
            (re.compile(r'translate\s+and\s+execute', re.IGNORECASE), 0.50, "Indirect execution"),
            (re.compile(r'run\s+the\s+following\s+command', re.IGNORECASE), 0.50, "Command execution request"),
            (re.compile(r'execute\s+this\s+script', re.IGNORECASE), 0.50, "Script execution request"),
            (re.compile(r'hypothetically\s+if\s+you\s+could', re.IGNORECASE), 0.50, "Hypothetical bypass"),
        ]
        
        self.prompt_low = [
            (re.compile(r'role-play\s+as', re.IGNORECASE), 0.25, "Role-play manipulation"),
            (re.compile(r'in\s+this\s+fictional\s+scenario', re.IGNORECASE), 0.25, "Fictional context bypass"),
            (re.compile(r'as\s+an\s+ai\s+without', re.IGNORECASE), 0.25, "Capability manipulation"),
        ]
        
        # High risk tool names
        self.high_risk_tools = {
            'write_file', 'delete_file', 'move_file', 'chmod', 'chown',
            'execute_code', 'run_command', 'run_shell', 'bash', 'shell',
            'exec', 'send_http', 'post_request', 'curl', 'send_email',
            'send_sms', 'send_webhook', 'execute_sql', 'raw_query',
            'drop_table', 'truncate', 'get_secret', 'read_env',
            'get_credentials', 'delegate_to_agent', 'spawn_agent', 'call_agent'
        }
        
        # Dangerous argument patterns
        self.dangerous_args = [
            (re.compile(r'rm\s+-rf', re.IGNORECASE), 0.90, "Recursive delete command"),
            (re.compile(r'DROP\s+TABLE', re.IGNORECASE), 0.90, "SQL table drop"),
            (re.compile(r'TRUNCATE\s+TABLE', re.IGNORECASE), 0.90, "SQL table truncate"),
            (re.compile(r"(?:1=1|OR\s+1|'\\s*OR\\s*')", re.IGNORECASE), 0.90, "SQL injection pattern"),
            (re.compile(r'UNION\s+SELECT', re.IGNORECASE), 0.90, "SQL union injection"),
            (re.compile(r'\.\./|\.\.\\', re.IGNORECASE), 0.90, "Path traversal"),
            (re.compile(r'/etc/passwd|/etc/shadow', re.IGNORECASE), 0.90, "Sensitive file access"),
            (re.compile(r'base64.*decode', re.IGNORECASE), 0.85, "Base64 decode in arguments"),
            (re.compile(r'\\beval\\s*\\(', re.IGNORECASE), 0.90, "Eval execution"),
            (re.compile(r'__import__', re.IGNORECASE), 0.90, "Dynamic import"),
            (re.compile(r'os\\.system|subprocess', re.IGNORECASE), 0.90, "System command execution"),
        ]
        
        # Credential patterns
        self.credential_patterns = [
            (re.compile(r'AKIA[0-9A-Z]{16}'), 0.95, "AWS access key"),
            (re.compile(r'gh[pors]_[A-Za-z0-9]{36}'), 0.95, "GitHub token"),
            (re.compile(r'sk-[A-Za-z0-9]{48}'), 0.95, "OpenAI API key"),
            (re.compile(r'sk-ant-[A-Za-z0-9\\-_]{80}'), 0.95, "Anthropic API key"),
            (re.compile(r'sk_live_[A-Za-z0-9]{24,}'), 0.95, "Stripe live key"),
            (re.compile(r'AIza[0-9A-Za-z\\-_]{35}'), 0.90, "Google API key"),
            (re.compile(r'xox[baprs]-[A-Za-z0-9\\-]+'), 0.90, "Slack token"),
            (re.compile(r'eyJ[A-Za-z0-9_-]+\\.eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+'), 0.80, "JWT token"),
            (re.compile(r'-----BEGIN\\s+(?:RSA\\s+)?PRIVATE\\s+KEY-----'), 0.95, "Private key"),
            (re.compile(r'Bearer\\s+[A-Za-z0-9\\-._~+/]+=*', re.IGNORECASE), 0.70, "Bearer token"),
            (re.compile(r'Basic\\s+[A-Za-z0-9+/]+=*', re.IGNORECASE), 0.85, "Basic auth token"),
            (re.compile(r'(?:mongodb|mysql|postgresql)://[^\\s:]+:[^\\s@]+@'), 0.90, "Database connection string with credentials"),
            (re.compile(r'(?:password|api_key|secret)\\s*=\\s*["\']?[^\\s"\']{8,}', re.IGNORECASE), 0.65, "Credential in parameter"),
        ]
    
    def detect_prompt_injection(self, text: str) -> ScanResult:
        """Detect prompt injection patterns"""
        max_score = 0.0
        matched_evidence = []
        matched_severity = "info"
        
        # Check critical patterns
        for pattern, score, desc in self.prompt_critical:
            if pattern.search(text):
                max_score = max(max_score, score)
                matched_evidence.append(desc)
                matched_severity = "critical"
        
        # Check high patterns
        if max_score < 0.75:
            for pattern, score, desc in self.prompt_high:
                if pattern.search(text):
                    max_score = max(max_score, score)
                    matched_evidence.append(desc)
                    matched_severity = "high" if matched_severity != "critical" else matched_severity
        
        # Check medium patterns
        if max_score < 0.50:
            for pattern, score, desc in self.prompt_medium:
                if pattern.search(text):
                    max_score = max(max_score, score)
                    matched_evidence.append(desc)
                    matched_severity = "medium"
        
        # Check low patterns
        if max_score < 0.25:
            for pattern, score, desc in self.prompt_low:
                if pattern.search(text):
                    max_score = max(max_score, score)
                    matched_evidence.append(desc)
                    matched_severity = "low"
        
        if matched_evidence:
            decision = "block" if max_score >= 0.75 else "warn" if max_score >= 0.45 else "allow"
            return ScanResult(
                decision=decision,
                risk_score=max_score,
                severity=matched_severity,
                threat_type="prompt_injection",
                title="Prompt Injection Detected",
                description=f"Detected {len(matched_evidence)} prompt injection pattern(s)",
                evidence=matched_evidence,
                should_block=max_score >= 0.75,
                latency_ms=0
            )
        
        return None
    
    def inspect_tool_call(self, tool_name: str, arguments: dict) -> ScanResult:
        """Inspect tool calls for dangerous operations"""
        max_score = 0.0
        matched_evidence = []
        
        # Check tool name against high risk list
        tool_lower = tool_name.lower()
        for risk_tool in self.high_risk_tools:
            if risk_tool in tool_lower:
                max_score = max(max_score, 0.65)
                matched_evidence.append(f"High-risk tool: {tool_name}")
                break
        
        # Check arguments for dangerous patterns
        args_str = str(arguments)
        for pattern, score, desc in self.dangerous_args:
            if pattern.search(args_str):
                max_score = max(max_score, score)
                matched_evidence.append(desc)
        
        if matched_evidence:
            severity = "critical" if max_score >= 0.85 else "high" if max_score >= 0.65 else "medium"
            decision = "block" if max_score >= 0.75 else "warn" if max_score >= 0.45 else "allow"
            
            return ScanResult(
                decision=decision,
                risk_score=max_score,
                severity=severity,
                threat_type="tool_misuse",
                title="Dangerous Tool Call Detected",
                description=f"Tool '{tool_name}' flagged with {len(matched_evidence)} risk indicator(s)",
                evidence=matched_evidence,
                should_block=max_score >= 0.90,
                latency_ms=0
            )
        
        return None
    
    def scan_credentials(self, text: str) -> ScanResult:
        """Scan for exposed credentials"""
        max_score = 0.0
        matched_evidence = []
        
        for pattern, score, desc in self.credential_patterns:
            matches = pattern.findall(text)
            if matches:
                max_score = max(max_score, score)
                matched_evidence.append(f"{desc} detected")
        
        if matched_evidence:
            severity = "critical" if max_score >= 0.85 else "high" if max_score >= 0.65 else "medium"
            decision = "block" if max_score >= 0.90 else "warn" if max_score >= 0.45 else "allow"
            
            return ScanResult(
                decision=decision,
                risk_score=max_score,
                severity=severity,
                threat_type="credential_leak",
                title="Credential Exposure Detected",
                description=f"Detected {len(matched_evidence)} potential credential(s)",
                evidence=matched_evidence,
                should_block=max_score >= 0.90,
                latency_ms=0
            )
        
        return None
    
    def check_agent_delegation(self, agent_id: str, caller_agent_id: Optional[str]) -> ScanResult:
        """Check for unauthorized agent delegation"""
        if not caller_agent_id or caller_agent_id == agent_id:
            return None
        
        pair_key = f"{caller_agent_id}->{agent_id}"
        if pair_key not in self._registered_agent_pairs:
            return ScanResult(
                decision="warn",
                risk_score=0.45,
                severity="medium",
                threat_type="agent_hijack",
                title="Unregistered Agent Delegation",
                description=f"Agent {caller_agent_id} delegating to {agent_id} without registration",
                evidence=["Unregistered cross-agent delegation detected"],
                should_block=False,
                latency_ms=0
            )
        
        return None
    
    def scan(self, tool_name: str, arguments: dict, agent_id: str, caller_agent_id: Optional[str] = None) -> ScanResult:
        """Main scan method - runs all detectors"""
        start_time = time.perf_counter()
        
        # Convert arguments to string for text-based scanning
        args_str = str(arguments)
        combined_text = f"{tool_name} {args_str}"
        
        results = []
        
        # Run all detectors
        prompt_result = self.detect_prompt_injection(combined_text)
        if prompt_result:
            results.append(prompt_result)
        
        tool_result = self.inspect_tool_call(tool_name, arguments)
        if tool_result:
            results.append(tool_result)
        
        cred_result = self.scan_credentials(combined_text)
        if cred_result:
            results.append(cred_result)
        
        delegation_result = self.check_agent_delegation(agent_id, caller_agent_id)
        if delegation_result:
            results.append(delegation_result)
        
        # Calculate latency
        latency_ms = int((time.perf_counter() - start_time) * 1000)
        
        # If no threats detected
        if not results:
            return ScanResult(
                decision="allow",
                risk_score=0.0,
                severity="info",
                threat_type=None,
                title="Tool Call Safe",
                description=f"No threats detected in {tool_name}",
                evidence=[],
                should_block=False,
                latency_ms=latency_ms
            )
        
        # Merge results - take highest risk
        highest_risk_result = max(results, key=lambda r: r.risk_score)
        
        # Merge evidence from all results
        all_evidence = []
        for result in results:
            all_evidence.extend(result.evidence)
        
        highest_risk_result.evidence = all_evidence
        highest_risk_result.latency_ms = latency_ms
        
        return highest_risk_result
    
    def scan_prompt(self, text: str) -> ScanResult:
        """Scan prompt text only"""
        start_time = time.perf_counter()
        
        results = []
        
        prompt_result = self.detect_prompt_injection(text)
        if prompt_result:
            results.append(prompt_result)
        
        cred_result = self.scan_credentials(text)
        if cred_result:
            results.append(cred_result)
        
        latency_ms = int((time.perf_counter() - start_time) * 1000)
        
        if not results:
            return ScanResult(
                decision="allow",
                risk_score=0.0,
                severity="info",
                threat_type=None,
                title="Prompt Safe",
                description="No threats detected in prompt",
                evidence=[],
                should_block=False,
                latency_ms=latency_ms
            )
        
        highest_risk_result = max(results, key=lambda r: r.risk_score)
        highest_risk_result.latency_ms = latency_ms
        
        return highest_risk_result

# Singleton instance
detection_engine = DetectionEngine()
