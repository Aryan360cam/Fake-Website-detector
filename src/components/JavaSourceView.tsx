import React, { useState } from 'react';
import { Copy, Check, Download, Code2, Terminal } from 'lucide-react';

export const JAVA_SOURCE_CODE = `import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.net.URI;
import java.util.*;
import java.util.regex.Pattern;

/**
 * PhishGuard - Fake Website & Phishing Link Detector
 * Standalone Java Swing GUI Application
 * White background with Dark Green Theme
 * 100% Client-Side Heuristic Analysis
 */
public class FakeWebsiteDetector extends JFrame {

    private static final Color BG_WHITE = new Color(255, 255, 255);
    private static final Color DARK_GREEN = new Color(6, 78, 59);       // #064E3B
    private static final Color TEXT_DARK = new Color(15, 23, 42);
    private static final Color TEXT_MUTED = new Color(100, 116, 139);
    private static final Color BORDER_COLOR = new Color(226, 232, 240);

    private static final Map<String, String> TARGET_BRANDS = new HashMap<>();
    static {
        TARGET_BRANDS.put("paypal", "paypal.com");
        TARGET_BRANDS.put("chase", "chase.com");
        TARGET_BRANDS.put("apple", "apple.com");
        TARGET_BRANDS.put("microsoft", "microsoft.com");
        TARGET_BRANDS.put("google", "google.com");
        TARGET_BRANDS.put("amazon", "amazon.com");
        TARGET_BRANDS.put("netflix", "netflix.com");
        TARGET_BRANDS.put("binance", "binance.com");
        TARGET_BRANDS.put("nike", "nike.com");
    }

    private static final Set<String> HIGH_ABUSE_TLDS = new HashSet<>(
            Arrays.asList("top", "xyz", "buzz", "click", "rest", "country", "cfd", "sbs", "icu", "bid", "tk", "ml")
    );

    private JTextField urlInputField;
    private JPanel resultPanel;

    public FakeWebsiteDetector() {
        setTitle("PhishGuard - Fake Website Detector (Java Edition)");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(850, 720);
        setLocationRelativeTo(null);
        getContentPane().setBackground(BG_WHITE);
        setLayout(new BorderLayout());

        initUI();
    }

    private void initUI() {
        // Header
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(BG_WHITE);
        headerPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 0, 1, 0, BORDER_COLOR),
                new EmptyBorder(16, 24, 16, 24)
        ));

        JLabel brandLabel = new JLabel("🛡 PhishGuard (Java Edition)");
        brandLabel.setFont(new Font("SansSerif", Font.BOLD, 18));
        brandLabel.setForeground(DARK_GREEN);
        headerPanel.add(brandLabel, BorderLayout.WEST);
        add(headerPanel, BorderLayout.NORTH);

        // Main input panel
        JPanel mainContent = new JPanel();
        mainContent.setLayout(new BoxLayout(mainContent, BoxLayout.Y_AXIS));
        mainContent.setBackground(BG_WHITE);
        mainContent.setBorder(new EmptyBorder(24, 24, 24, 24));

        JLabel titleLabel = new JLabel("Check if a website is safe before you click");
        titleLabel.setFont(new Font("SansSerif", Font.BOLD, 20));
        titleLabel.setForeground(TEXT_DARK);
        mainContent.add(titleLabel);

        mainContent.add(Box.createVerticalStrut(14));

        JPanel inputRow = new JPanel(new BorderLayout(8, 0));
        inputRow.setBackground(BG_WHITE);
        inputRow.setMaximumSize(new Dimension(Integer.MAX_VALUE, 42));

        urlInputField = new JTextField("https://chase-online-verify-security.xyz/login/auth");
        urlInputField.setFont(new Font("Monospaced", Font.PLAIN, 13));
        inputRow.add(urlInputField, BorderLayout.CENTER);

        JButton checkButton = new JButton("Check Website");
        checkButton.setBackground(DARK_GREEN);
        checkButton.setForeground(Color.WHITE);
        checkButton.addActionListener(e -> runAnalysis(urlInputField.getText().trim()));
        inputRow.add(checkButton, BorderLayout.EAST);

        mainContent.add(inputRow);
        mainContent.add(Box.createVerticalStrut(16));

        resultPanel = new JPanel();
        resultPanel.setLayout(new BoxLayout(resultPanel, BoxLayout.Y_AXIS));
        resultPanel.setBackground(BG_WHITE);

        JScrollPane scrollPane = new JScrollPane(resultPanel);
        scrollPane.setBorder(null);

        JPanel centerWrapper = new JPanel(new BorderLayout());
        centerWrapper.setBackground(BG_WHITE);
        centerWrapper.add(mainContent, BorderLayout.NORTH);
        centerWrapper.add(scrollPane, BorderLayout.CENTER);

        add(centerWrapper, BorderLayout.CENTER);

        runAnalysis(urlInputField.getText().trim());
    }

    private void runAnalysis(String rawUrl) {
        resultPanel.removeAll();
        if (rawUrl.isEmpty()) return;

        String normalized = rawUrl.startsWith("http") ? rawUrl : "https://" + rawUrl;
        String host = "";
        try {
            URI uri = new URI(normalized);
            host = uri.getHost() != null ? uri.getHost().toLowerCase() : "";
        } catch (Exception ex) {
            host = rawUrl.toLowerCase().replaceAll("^https?://", "").split("/")[0];
        }

        String[] parts = host.split("\\\\.");
        String tld = parts.length > 1 ? parts[parts.length - 1] : "";
        String domainName = parts.length > 1 ? parts[parts.length - 2] : host;

        int score = 100;
        boolean isHomoglyph = host.contains("xn--") || Pattern.compile("[\\\\u0400-\\\\u04FF]").matcher(host).find();
        boolean isHighRiskTld = HIGH_ABUSE_TLDS.contains(tld);

        String impersonated = null;
        for (String brand : TARGET_BRANDS.keySet()) {
            if (domainName.contains(brand) && !host.equals(TARGET_BRANDS.get(brand))) {
                impersonated = brand;
                score -= 50;
                break;
            }
        }
        if (isHomoglyph) score -= 45;
        if (isHighRiskTld) score -= 25;
        score = Math.max(0, score);

        JLabel resLabel = new JLabel(score <= 45 ? "Dangerous: Fake Website Detected" : "Safe & Legitimate Website");
        resLabel.setFont(new Font("SansSerif", Font.BOLD, 16));
        resLabel.setForeground(score <= 45 ? Color.RED : DARK_GREEN);
        resultPanel.add(resLabel);

        JLabel scoreLabel = new JLabel("Safety Score: " + score + "%");
        resultPanel.add(scoreLabel);

        resultPanel.revalidate();
        resultPanel.repaint();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new FakeWebsiteDetector().setVisible(true));
    }
}`;

export const JavaSourceView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JAVA_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([JAVA_SOURCE_CODE], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'FakeWebsiteDetector.java';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-emerald-900" />
            <h2 className="text-lg font-bold text-slate-900">
              FakeWebsiteDetector.java (Desktop Edition)
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            Pure standalone Java desktop GUI application using standard Java Swing and AWT. No external dependencies required.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-xs transition"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-800" />
                <span className="text-emerald-900 font-semibold">Copied Java</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Java Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-medium shadow-xs transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download .java</span>
          </button>
        </div>
      </div>

      {/* Compile & Run Instructions */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900">
          <Terminal className="h-4 w-4 text-emerald-900" />
          <span>How to run this Java application:</span>
        </div>
        <div className="font-mono bg-white p-2.5 rounded border border-slate-200 text-slate-800">
          javac FakeWebsiteDetector.java<br />
          java FakeWebsiteDetector
        </div>
        <p className="text-slate-600 text-[11px]">
          Runs on any computer with Java installed (JDK 8 or higher). Features the identical white background and dark green color scheme.
        </p>
      </div>

      {/* Code Viewer */}
      <div className="relative">
        <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-[420px] leading-relaxed">
          {JAVA_SOURCE_CODE}
        </pre>
      </div>
    </div>
  );
};
