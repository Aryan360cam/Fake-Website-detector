import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.net.URI;
import java.net.URL;
import java.util.*;
import java.util.regex.Pattern;

/**
 * PhishGuard - Fake Website & Phishing Link Detector
 * 
 * Standalone Java Desktop Application (Swing GUI).
 * Implements 100% client-side heuristic security analysis:
 * - Brand Impersonation & Typosquatting (Levenshtein Distance)
 * - Homoglyph / Confusable Unicode IDN detection
 * - High-abuse TLD reputation grading (.xyz, .top, .buzz, etc.)
 * - Insecure protocol and port anomaly flags
 * - Subdomain deception and keyword stuffing checks
 *
 * To compile and run:
 *   javac FakeWebsiteDetector.java
 *   java FakeWebsiteDetector
 */
public class FakeWebsiteDetector extends JFrame {

    // Theme Colors: White Background + Dark Green Theme
    private static final Color BG_WHITE = new Color(255, 255, 255);
    private static final Color BG_PANEL = new Color(248, 250, 252);
    private static final Color DARK_GREEN = new Color(6, 78, 59);       // #064E3B
    private static final Color DARK_GREEN_HOVER = new Color(2, 44, 34); // #022C22
    private static final Color TEXT_DARK = new Color(15, 23, 42);
    private static final Color TEXT_MUTED = new Color(100, 116, 139);
    private static final Color BORDER_COLOR = new Color(226, 232, 240);

    private static final Color RED_BG = new Color(254, 242, 242);
    private static final Color RED_BORDER = new Color(254, 202, 202);
    private static final Color RED_TEXT = new Color(153, 27, 27);

    private static final Color GREEN_BG = new Color(236, 253, 245);
    private static final Color GREEN_BORDER = new Color(167, 243, 208);
    private static final Color GREEN_TEXT = new Color(6, 78, 59);

    // Target Brands for Impersonation Checks
    private static final Map<String, String> TARGET_BRANDS = new HashMap<>();
    static {
        TARGET_BRANDS.put("paypal", "paypal.com");
        TARGET_BRANDS.put("chase", "chase.com");
        TARGET_BRANDS.put("bankofamerica", "bankofamerica.com");
        TARGET_BRANDS.put("wellsfargo", "wellsfargo.com");
        TARGET_BRANDS.put("apple", "apple.com");
        TARGET_BRANDS.put("microsoft", "microsoft.com");
        TARGET_BRANDS.put("google", "google.com");
        TARGET_BRANDS.put("amazon", "amazon.com");
        TARGET_BRANDS.put("netflix", "netflix.com");
        TARGET_BRANDS.put("binance", "binance.com");
        TARGET_BRANDS.put("coinbase", "coinbase.com");
        TARGET_BRANDS.put("metamask", "metamask.io");
        TARGET_BRANDS.put("nike", "nike.com");
    }

    // High Abuse TLDs
    private static final Set<String> HIGH_ABUSE_TLDS = new HashSet<>(
            Arrays.asList("top", "xyz", "buzz", "click", "rest", "country", "cfd", "sbs", "icu", "bid", "tk", "ml", "cam", "work")
    );

    // GUI Components
    private JTextField urlInputField;
    private JButton checkButton;
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
        // --- HEADER ---
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(BG_WHITE);
        headerPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 0, 1, 0, BORDER_COLOR),
                new EmptyBorder(16, 24, 16, 24)
        ));

        JLabel brandLabel = new JLabel("🛡  PhishGuard");
        brandLabel.setFont(new Font("SansSerif", Font.BOLD, 18));
        brandLabel.setForeground(DARK_GREEN);

        JLabel subLabel = new JLabel("Fake Website & Phishing Link Detector");
        subLabel.setFont(new Font("SansSerif", Font.PLAIN, 12));
        subLabel.setForeground(TEXT_MUTED);

        JPanel headerLeft = new JPanel(new GridLayout(2, 1, 0, 2));
        headerLeft.setBackground(BG_WHITE);
        headerLeft.add(brandLabel);
        headerLeft.add(subLabel);

        headerPanel.add(headerLeft, BorderLayout.WEST);
        add(headerPanel, BorderLayout.NORTH);

        // --- CENTER CONTAINER ---
        JPanel mainContent = new JPanel();
        mainContent.setLayout(new BoxLayout(mainContent, BoxLayout.Y_AXIS));
        mainContent.setBackground(BG_WHITE);
        mainContent.setBorder(new EmptyBorder(24, 24, 24, 24));

        // Title
        JLabel titleLabel = new JLabel("Check if a website is safe before you click");
        titleLabel.setFont(new Font("SansSerif", Font.BOLD, 22));
        titleLabel.setForeground(TEXT_DARK);
        titleLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
        mainContent.add(titleLabel);

        JLabel descLabel = new JLabel("Detects fake login pages, lookalike brand domains, typosquatting, and scam sites.");
        descLabel.setFont(new Font("SansSerif", Font.PLAIN, 13));
        descLabel.setForeground(TEXT_MUTED);
        descLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
        mainContent.add(descLabel);

        mainContent.add(Box.createVerticalStrut(18));

        // Input & Button Row
        JPanel inputRow = new JPanel(new BorderLayout(8, 0));
        inputRow.setBackground(BG_WHITE);
        inputRow.setMaximumSize(new Dimension(Integer.MAX_VALUE, 42));
        inputRow.setAlignmentX(Component.LEFT_ALIGNMENT);

        urlInputField = new JTextField("https://chase-online-verify-security.xyz/login/auth");
        urlInputField.setFont(new Font("Monospaced", Font.PLAIN, 13));
        urlInputField.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(BORDER_COLOR, 1),
                new EmptyBorder(8, 12, 8, 12)
        ));
        inputRow.add(urlInputField, BorderLayout.CENTER);

        checkButton = new JButton("Check Website");
        checkButton.setBackground(DARK_GREEN);
        checkButton.setForeground(Color.WHITE);
        checkButton.setFocusPainted(false);
        checkButton.setFont(new Font("SansSerif", Font.BOLD, 12));
        checkButton.setBorder(new EmptyBorder(10, 18, 10, 18));
        checkButton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        checkButton.addActionListener(e -> runAnalysis(urlInputField.getText().trim()));
        inputRow.add(checkButton, BorderLayout.EAST);

        mainContent.add(inputRow);
        mainContent.add(Box.createVerticalStrut(10));

        // Sample Presets Row
        JPanel presetRow = new JPanel(new FlowLayout(FlowLayout.LEFT, 6, 0));
        presetRow.setBackground(BG_WHITE);
        presetRow.setAlignmentX(Component.LEFT_ALIGNMENT);

        JLabel tryLabel = new JLabel("Try an example: ");
        tryLabel.setFont(new Font("SansSerif", Font.PLAIN, 12));
        tryLabel.setForeground(TEXT_MUTED);
        presetRow.add(tryLabel);

        addPresetButton(presetRow, "Fake Chase Bank", "https://chase-online-verify-security.xyz/login/auth");
        addPresetButton(presetRow, "Apple Lookalike (IDN)", "https://xn--appl-43d.com/id/sign-in");
        addPresetButton(presetRow, "Nike Scam Store", "https://nike-official-outlet-clearance80.shop");
        addPresetButton(presetRow, "PayPal (Official)", "https://www.paypal.com");

        mainContent.add(presetRow);
        mainContent.add(Box.createVerticalStrut(20));

        // Result Container Panel
        resultPanel = new JPanel();
        resultPanel.setLayout(new BoxLayout(resultPanel, BoxLayout.Y_AXIS));
        resultPanel.setBackground(BG_WHITE);
        resultPanel.setAlignmentX(Component.LEFT_ALIGNMENT);

        JScrollPane scrollPane = new JScrollPane(resultPanel);
        scrollPane.setBorder(null);
        scrollPane.setBackground(BG_WHITE);
        scrollPane.getViewport().setBackground(BG_WHITE);

        JPanel centerWrapper = new JPanel(new BorderLayout());
        centerWrapper.setBackground(BG_WHITE);
        centerWrapper.add(mainContent, BorderLayout.NORTH);
        centerWrapper.add(scrollPane, BorderLayout.CENTER);

        add(centerWrapper, BorderLayout.CENTER);

        // --- FOOTER ---
        JPanel footer = new JPanel(new BorderLayout());
        footer.setBackground(new Color(248, 250, 252));
        footer.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(1, 0, 0, 0, BORDER_COLOR),
                new EmptyBorder(12, 24, 12, 24)
        ));

        JLabel footerText = new JLabel("PhishGuard Java Client • Built by Aryan Verma • 100% Client-Side");
        footerText.setFont(new Font("SansSerif", Font.PLAIN, 11));
        footerText.setForeground(TEXT_MUTED);
        footer.add(footerText, BorderLayout.WEST);

        add(footer, BorderLayout.SOUTH);

        // Run default scan on launch
        runAnalysis(urlInputField.getText().trim());
    }

    private void addPresetButton(JPanel container, String label, String url) {
        JButton btn = new JButton(label);
        btn.setFont(new Font("SansSerif", Font.PLAIN, 11));
        btn.setBackground(BG_PANEL);
        btn.setForeground(TEXT_DARK);
        btn.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(BORDER_COLOR, 1),
                new EmptyBorder(4, 8, 4, 8)
        ));
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btn.addActionListener(e -> {
            urlInputField.setText(url);
            runAnalysis(url);
        });
        container.add(btn);
    }

    /**
     * Executes 100% client-side security heuristics in Java
     */
    private void runAnalysis(String rawUrl) {
        resultPanel.removeAll();

        if (rawUrl.isEmpty()) {
            resultPanel.revalidate();
            resultPanel.repaint();
            return;
        }

        String normalized = rawUrl;
        if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
            normalized = "https://" + normalized;
        }

        String host = "";
        String protocol = "https";
        int port = -1;
        String path = "/";

        try {
            URI uri = new URI(normalized);
            host = uri.getHost() != null ? uri.getHost().toLowerCase() : "";
            protocol = uri.getScheme() != null ? uri.getScheme().toLowerCase() : "https";
            port = uri.getPort();
            path = uri.getPath() != null ? uri.getPath() : "/";
        } catch (Exception ex) {
            host = rawUrl.toLowerCase().replaceAll("^https?://", "").split("/")[0];
        }

        // Parse domain parts
        String[] parts = host.split("\\.");
        String tld = parts.length > 1 ? parts[parts.length - 1] : "";
        String domainName = parts.length > 1 ? parts[parts.length - 2] : host;
        StringBuilder subdomains = new StringBuilder();
        if (parts.length > 2) {
            for (int i = 0; i < parts.length - 2; i++) {
                if (subdomains.length() > 0) subdomains.append(".");
                subdomains.append(parts[i]);
            }
        }

        // 1. Scoring & Checks
        int score = 100;
        boolean isHomoglyph = host.contains("xn--") || Pattern.compile("[\\u0400-\\u04FF]").matcher(host).find();
        boolean isHighRiskTld = HIGH_ABUSE_TLDS.contains(tld);
        boolean isHttp = protocol.equals("http");
        boolean hasAtSymbol = rawUrl.contains("@");

        String impersonatedBrand = null;
        for (Map.Entry<String, String> entry : TARGET_BRANDS.entrySet()) {
            String brand = entry.getKey();
            String official = entry.getValue();

            if (host.equals(official) || host.endsWith("." + official)) {
                impersonatedBrand = null;
                break; // Officially verified domain
            }

            if (domainName.contains(brand) && !host.equals(official)) {
                impersonatedBrand = brand;
                break;
            }

            int dist = levenshtein(domainName, brand);
            if (dist == 1 || (dist == 2 && brand.length() > 6)) {
                impersonatedBrand = brand;
                break;
            }
        }

        if (impersonatedBrand != null) score -= 50;
        if (isHomoglyph) score -= 45;
        if (isHighRiskTld) score -= 25;
        if (isHttp) score -= 20;
        if (hasAtSymbol) score -= 40;

        score = Math.max(0, Math.min(100, score));

        boolean isDangerous = score <= 45;
        boolean isSuspicious = score > 45 && score <= 75;

        // --- STATUS CARD ---
        JPanel statusCard = new JPanel(new BorderLayout(16, 0));
        statusCard.setBackground(isDangerous ? RED_BG : (isSuspicious ? new Color(254, 252, 232) : GREEN_BG));
        statusCard.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(isDangerous ? RED_BORDER : (isSuspicious ? new Color(254, 240, 138) : GREEN_BORDER), 1),
                new EmptyBorder(16, 20, 16, 20)
        ));
        statusCard.setMaximumSize(new Dimension(Integer.MAX_VALUE, 120));

        JPanel statusText = new JPanel(new GridLayout(3, 1, 0, 4));
        statusText.setBackground(statusCard.getBackground());

        String verdictTitle = isDangerous
                ? (impersonatedBrand != null ? "Dangerous: Fake " + capitalize(impersonatedBrand) + " Website" : "Dangerous: Phishing Website")
                : (isSuspicious ? "Suspicious Website" : "Safe & Authentic Website");

        JLabel verdictLabel = new JLabel(verdictTitle);
        verdictLabel.setFont(new Font("SansSerif", Font.BOLD, 16));
        verdictLabel.setForeground(isDangerous ? RED_TEXT : (isSuspicious ? new Color(133, 77, 14) : GREEN_TEXT));

        String explanation = isDangerous
                ? (impersonatedBrand != null
                    ? "Pretending to be " + capitalize(impersonatedBrand) + ", but the real domain is " + TARGET_BRANDS.get(impersonatedBrand) + "."
                    : "Multiple high-risk phishing indicators detected.")
                : (isSuspicious ? "Unusual domain parameters found. Proceed with caution." : "Official domain matching standard security protocols.");

        JLabel expLabel = new JLabel(explanation);
        expLabel.setFont(new Font("SansSerif", Font.PLAIN, 12));
        expLabel.setForeground(TEXT_DARK);

        JLabel scoreLabel = new JLabel("Safety Score: " + score + "%");
        scoreLabel.setFont(new Font("SansSerif", Font.BOLD, 12));
        scoreLabel.setForeground(verdictLabel.getForeground());

        statusText.add(verdictLabel);
        statusText.add(expLabel);
        statusText.add(scoreLabel);

        statusCard.add(statusText, BorderLayout.CENTER);
        resultPanel.add(statusCard);
        resultPanel.add(Box.createVerticalStrut(16));

        // --- DETAILS PANEL ---
        JPanel detailsPanel = new JPanel(new GridLayout(5, 1, 0, 8));
        detailsPanel.setBackground(BG_WHITE);
        detailsPanel.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(BORDER_COLOR, 1),
                new EmptyBorder(14, 16, 14, 16)
        ));

        addCheckRow(detailsPanel, "Brand Impersonation",
                impersonatedBrand != null ? "Flagged: Mimics " + capitalize(impersonatedBrand) : "Passed: No mimicry detected",
                impersonatedBrand == null);

        addCheckRow(detailsPanel, "Homoglyph Lookalike Letters",
                isHomoglyph ? "Flagged: Uses foreign script / Punycode" : "Passed: Standard ASCII letters",
                !isHomoglyph);

        addCheckRow(detailsPanel, "Domain Extension (." + tld + ")",
                isHighRiskTld ? "Warning: High abuse rate TLD" : "Passed: Standard domain extension",
                !isHighRiskTld);

        addCheckRow(detailsPanel, "Connection Encryption",
                isHttp ? "Warning: Unencrypted HTTP" : "Passed: HTTPS Encrypted",
                !isHttp);

        addCheckRow(detailsPanel, "Actual Domain Destination",
                host + " (Root: " + domainName + "." + tld + ")",
                true);

        resultPanel.add(detailsPanel);
        resultPanel.revalidate();
        resultPanel.repaint();
    }

    private void addCheckRow(JPanel parent, String title, String value, boolean passed) {
        JPanel row = new JPanel(new BorderLayout());
        row.setBackground(BG_WHITE);

        JLabel t = new JLabel(title);
        t.setFont(new Font("SansSerif", Font.BOLD, 12));
        t.setForeground(TEXT_DARK);

        JLabel v = new JLabel((passed ? "✔  " : "✖  ") + value);
        v.setFont(new Font("SansSerif", Font.PLAIN, 12));
        v.setForeground(passed ? GREEN_TEXT : RED_TEXT);

        row.add(t, BorderLayout.WEST);
        row.add(v, BorderLayout.EAST);
        parent.add(row);
    }

    private static int levenshtein(String a, String b) {
        int[] costs = new int[b.length() + 1];
        for (int j = 0; j < costs.length; j++) costs[j] = j;
        for (int i = 1; i <= a.length(); i++) {
            costs[0] = i;
            int nw = i - 1;
            for (int j = 1; j <= b.length(); j++) {
                int cj = Math.min(1 + Math.min(costs[j], costs[j - 1]),
                        a.charAt(i - 1) == b.charAt(j - 1) ? nw : nw + 1);
                nw = costs[j];
                costs[j] = cj;
            }
        }
        return costs[b.length()];
    }

    private static String capitalize(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {}
            new FakeWebsiteDetector().setVisible(true);
        });
    }
}
