import React, { useState } from 'react';
import Sidebar, { MobileTopBar } from './Sidebar';
import CreateUrlModal from './CreateUrlModal';
import EditUrlModal from './EditUrlModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import QRModal from './QrModal';
import BulkUploadModal from './BulkUploadModal';

export default function AppLayout({ children, modalsProps = {} }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Expose global open functions for modals if not already injected
  window.openBulkModal = () => modalsProps.setShowBulkModal && modalsProps.setShowBulkModal(true);

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
        <MobileTopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-x-hidden relative">
          {children}
        </main>
      </div>

      {/* Render modals here so they overlay the entire app including layout */}
      {modalsProps.showCreateModal !== undefined && (
        <>
          <CreateUrlModal 
            isOpen={modalsProps.showCreateModal} 
            onClose={() => modalsProps.setShowCreateModal(false)} 
            onSuccess={modalsProps.onCreateSuccess} 
          />
          <EditUrlModal 
            isOpen={modalsProps.showEditModal} 
            onClose={() => modalsProps.setShowEditModal(false)} 
            url={modalsProps.selectedUrl} 
            onSuccess={modalsProps.onEditSuccess} 
          />
          <DeleteConfirmModal 
            isOpen={modalsProps.showDeleteModal} 
            onClose={() => modalsProps.setShowDeleteModal(false)} 
            url={modalsProps.selectedUrl} 
            onConfirm={modalsProps.onDeleteConfirm} 
          />
          <QRModal 
            isOpen={modalsProps.showQRModal} 
            onClose={() => modalsProps.setShowQRModal(false)} 
            url={modalsProps.selectedUrl} 
          />
          <BulkUploadModal 
            isOpen={modalsProps.showBulkModal} 
            onClose={() => modalsProps.setShowBulkModal(false)} 
            onSuccess={modalsProps.onBulkSuccess} 
          />
        </>
      )}
    </div>
  );
}
