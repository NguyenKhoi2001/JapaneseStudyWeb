import os
print("Current Working Directory:", os.getcwd())
# os.chdir('your_preferred_directory_path')

import torchaudio
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor

def load_audio(file_path):
    waveform, sample_rate = torchaudio.load(file_path)
    return waveform, sample_rate

def resample(waveform, source_sr, target_sr=16000):
    if source_sr != target_sr:
        transformer = torchaudio.transforms.Resample(source_sr, target_sr)
        waveform = transformer(waveform)
    return waveform

def transcribe(audio_path):
    # Load and process the model
    model_name = "Kyubyong/wav2vec2-large-xlsr-japanese"
    processor = Wav2Vec2Processor.from_pretrained(model_name)
    model = Wav2Vec2ForCTC.from_pretrained(model_name)

    # Load audio
    waveform, sample_rate = load_audio(audio_path)
    waveform = resample(waveform, sample_rate)

    # Process audio to model input format
    inputs = processor(waveform.squeeze(0), sampling_rate=16000, return_tensors="pt", padding=True)

    # Inference
    with torch.no_grad():
        logits = model(**inputs).logits

    # Decode the logits
    predicted_ids = torch.argmax(logits, dim=-1)
    transcription = processor.batch_decode(predicted_ids)

    return transcription[0]

# Example usage
audio_file = "CD01.mp3"
transcribed_text = transcribe(audio_file)
print(f"Transcribed Text: {transcribed_text}")
