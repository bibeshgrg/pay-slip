<script lang="ts">
    import { Dialog } from "bits-ui";
    export let image: string;


  </script>
   
  <Dialog.Root>
    <Dialog.Trigger
      class="rounded-input bg-dark text-background
        shadow-mini hover:bg-dark/95 focus-visible:ring-foreground focus-visible:ring-offset-background focus-visible:outline-hidden
        inline-flex h-12 items-center justify-center whitespace-nowrap px-[21px] text-[15px] font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
    >
        {#if image}
            <button class="preview-box cursor-pointer" >
                <img src="{image}" alt="Signature Preview" class="signature-img rounded-lg" />
            </button>
        {/if}
    </Dialog.Trigger>
    <Dialog.Portal>
        <Dialog.Overlay
          class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80"
        />
        <Dialog.Content
          class="rounded-card-lg bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-hidden fixed left-[50%] top-[50%] z-50 w-full max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[900px] translate-x-[-50%] translate-y-[-50%] p-6"
        >
          <div class="image-container">
            <img src="{image}" alt="Dialog" class="dialog-image" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
  </Dialog.Root>
  

  <style>
    .preview-box {
    width: 200px;
    height: 100px;
    border: 2px dashed #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 8px;
  }
  .signature-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }

  .dialog-image {
    width: 100%;
    max-width: 800px; /* Adjust as needed */
    max-height: 90vh; /* Ensure it doesn't exceed viewport height */
    object-fit: contain;
    border-radius: 10px;
  }
  </style>