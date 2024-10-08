import React, { useState } from "react";
import { Files } from "../data/fileData";
import "./FileExplorer.css";
import FolderIcon from "../icons/FolderIcon";
import FileIcon from "../icons/FileIcon";

export interface FileNode {
  type: "file" | "folder";
  name: string;
  meta?: string;
  data?: FileNode[];
}

interface FolderProps {
  node: FileNode;
  onSelect: (fileName: string) => void;
  onRightClick: (e: React.MouseEvent, fileName: string) => void;
  selectedFile: string | null;
}

const Folder: React.FC<FolderProps> = ({
  node,
  onSelect,
  onRightClick,
  selectedFile,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <div className="folder" onClick={() => setIsExpanded(!isExpanded)}>
        <FolderIcon /> {node.name}
      </div>
      {isExpanded && (
        <div className="children">
          {node.data?.map((childNode) => (
            <div key={childNode.name}>
              {childNode.type === "folder" ? (
                <Folder
                  node={childNode}
                  onSelect={onSelect}
                  onRightClick={onRightClick}
                  selectedFile={selectedFile}
                />
              ) : (
                <div
                  className={`file ${
                    selectedFile === childNode.name ? "selected" : ""
                  }`}
                  onClick={() => onSelect(childNode.name)}
                  onContextMenu={(e) => onRightClick(e, childNode.name)}
                >
                  <FileIcon /> {childNode.name}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    fileName: string | null;
  }>({ visible: false, x: 0, y: 0, fileName: null });

  const handleSelect = (fileName: string) => {
    setSelectedFile(fileName);
  };

  const handleRightClick = (e: React.MouseEvent, fileName: string) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, fileName });
  };

  const handleContextMenuAction = (action: string) => {
    if (contextMenu.fileName) {
      console.log(`${action} on ${contextMenu.fileName}`);
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  return (
    <div
      className="file-explorer"
      onClick={() => setContextMenu({ ...contextMenu, visible: false })}
    >
      <Folder
        node={Files}
        onSelect={handleSelect}
        onRightClick={handleRightClick}
        selectedFile={selectedFile}
      />
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <div onClick={() => handleContextMenuAction("copy")}>Copy</div>
          <div onClick={() => handleContextMenuAction("delete")}>Delete</div>
          <div onClick={() => handleContextMenuAction("rename")}>Rename</div>
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
