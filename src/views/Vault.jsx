import React from 'react';

// You can move this ID to .env later if you want
const MAIN_DRIVE_ID = "1pA8RfbOh8QbY6EywJzXE08oILKwSyQpM";

export default function Vault() {
  return (
    <div className="w-full h-[650px] rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl animate-in fade-in duration-700">
      <iframe src={`https://drive.google.com/embeddedfolderview?id=${MAIN_DRIVE_ID}#grid`} className="w-full h-full border-none" title="Sync-Us Vault" />
    </div>
  );
}