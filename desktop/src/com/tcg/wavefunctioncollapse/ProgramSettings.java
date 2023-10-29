package com.tcg.wavefunctioncollapse;

import org.yaml.snakeyaml.LoaderOptions;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

import javax.swing.*;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import java.awt.*;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.function.Consumer;

public class ProgramSettings extends JFrame {

    private final JTextField widthField;
    private final JTextField heightField;

    private final JLabel selectFileLabel;

    private final JButton launch;

    private Consumer<WaveFunctionCollapseLaunchParams> launchCallback;

    private String selectedFilePath;

    private int tileSizeWidth;
    private int tileSizeHeight;

    public ProgramSettings() throws HeadlessException {
        super("Wave Function Collapse");

        this.widthField = getIntegerField();
        this.heightField = getIntegerField();

        this.selectFileLabel = new JLabel("Select Tileset File");
        JButton selectFileButton = new JButton("Select File");
        selectFileButton.addActionListener(e -> selectTilesetFile());

        final JPanel gridPanel = new JPanel(new GridLayout(3, 2, 5, 5));

        gridPanel.add(new JLabel("Width"));
        gridPanel.add(widthField);
        gridPanel.add(new JLabel("Height"));
        gridPanel.add(heightField);
        gridPanel.add(selectFileLabel);
        gridPanel.add(selectFileButton);

        this.launch = new JButton("Launch");
        this.launch.setEnabled(false);
        this.launch.addActionListener(l -> {
            if (this.launchCallback == null) return;
            if (this.selectedFilePath == null) return;
            final String widthText = this.widthField.getText().trim();
            final String heightText = this.heightField.getText().trim();
            if (widthText.isEmpty() || heightText.isEmpty()) return;
            final int width = Integer.parseInt(widthText);
            final int height = Integer.parseInt(heightText);
            final WaveFunctionCollapseLaunchParams waveFunctionCollapseLaunchParams = new WaveFunctionCollapseLaunchParams();
            waveFunctionCollapseLaunchParams.tilesWidth = width;
            waveFunctionCollapseLaunchParams.tilesHeight = height;
            waveFunctionCollapseLaunchParams.tilesetPath = this.selectedFilePath;
            waveFunctionCollapseLaunchParams.tileSizeWidth = this.tileSizeWidth;
            waveFunctionCollapseLaunchParams.tileSizeHeight = this.tileSizeHeight;
            SwingUtilities.invokeLater(() -> this.launchCallback.accept(waveFunctionCollapseLaunchParams));
        });

        final JPanel mainPanel = new JPanel(new BorderLayout(5, 5));

        mainPanel.add(gridPanel, BorderLayout.CENTER);
        mainPanel.add(launch, BorderLayout.SOUTH);

        mainPanel.setBorder(BorderFactory.createEmptyBorder(5, 5, 5, 5));


        this.setContentPane(mainPanel);

        this.pack();
        this.setSize(310, this.getHeight());
        this.setLocationRelativeTo(null);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

    private void selectTilesetFile() {
        this.selectedFilePath = null;
        try {
            final JFileChooser fileChooser = getChooser();
            final int result = fileChooser.showOpenDialog(this);
            if (result != JFileChooser.APPROVE_OPTION) return;
            final File selectedFile = fileChooser.getSelectedFile();
            final Path selectedFilePath = Paths.get(selectedFile.getAbsolutePath());
            final String yamlText = new String(Files.readAllBytes(selectedFilePath));
            final Tileset.TilesetDocument tileSet = new Yaml(new Constructor(Tileset.TilesetDocument.class, new LoaderOptions())).load(yamlText);
            final Path sourcePath = selectedFilePath.resolveSibling(Paths.get(tileSet.source));
            if (!sourcePath.toFile().exists())
                throw new Exception(String.format("Tileset source file does not exist: %s", sourcePath));
            SwingUtilities.invokeLater(() -> {
                final String currentWidthText = this.widthField.getText().trim();
                final String currentHeightText = this.heightField.getText().trim();
                if (currentWidthText.isEmpty() && currentHeightText.isEmpty()) {
                    int width = 1920 / tileSet.tileWidth;
                    int height = 1080 / tileSet.tileHeight;
                    this.widthField.setText(String.valueOf(width));
                    this.heightField.setText(String.valueOf(height));
                }
                this.tileSizeWidth = tileSet.tileWidth;
                this.tileSizeHeight = tileSet.tileHeight;
                this.selectedFilePath = selectedFilePath.toAbsolutePath().toString();
                this.selectFileLabel.setText(selectedFilePath.getFileName().toString());
                this.launch.setEnabled(true);
            });
        } catch (Exception e) {
            //noinspection CallToPrintStackTrace
            e.printStackTrace();
            SwingUtilities.invokeLater(() -> this.launch.setEnabled(false));
        }
    }

    private static JFileChooser getChooser() {
        final JFileChooser fileChooser = new JFileChooser();
        fileChooser.setCurrentDirectory(new File("."));
        fileChooser.setFileFilter(new javax.swing.filechooser.FileFilter() {
            @Override
            public boolean accept(File f) {
                return f.isDirectory() || f.getName().endsWith(".yml") || f.getName().endsWith(".yaml");
            }

            @Override
            public String getDescription() {
                return "YAML Files (*.yml, *.yaml)";
            }
        });
        return fileChooser;
    }

    private JTextField getIntegerField() {
        final JTextField field = new JTextField();
        field.getDocument().addDocumentListener(new DocumentListener() {
            @Override
            public void insertUpdate(DocumentEvent e) {
                filterNonDigitsOutOfTextField(field);
            }

            @Override
            public void removeUpdate(DocumentEvent e) {
                filterNonDigitsOutOfTextField(field);
            }

            @Override
            public void changedUpdate(DocumentEvent e) {
                filterNonDigitsOutOfTextField(field);
            }
        });
        return field;
    }

    private void filterNonDigitsOutOfTextField(final JTextField field) {
        final String currentText = field.getText();
        final String filteredText = currentText.replaceAll("\\D", "");
        if (!currentText.equals(filteredText)) {
            SwingUtilities.invokeLater(() -> field.setText(filteredText));
        }
    }

    public void setLaunchCallback(Consumer<WaveFunctionCollapseLaunchParams> launchCallback) {
        this.launchCallback = launchCallback;
    }
}
