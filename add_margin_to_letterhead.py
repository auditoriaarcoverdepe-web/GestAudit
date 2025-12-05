from PIL import Image

# Open the original letterhead
img = Image.open(r'c:\Users\erina\dyad-apps\GestAudit\public\timbrado.jpg')

# Get original dimensions
width, height = img.size

# Calculate 3.5cm in pixels (assuming 96 DPI: 3.5cm = 1.378 inches = 132 pixels)
# For print quality (300 DPI): 3.5cm = 413 pixels
margin_pixels = 413  # Using print DPI

# Create new image with white background
new_height = height + margin_pixels
new_img = Image.new('RGB', (width, new_height), 'white')

# Paste original image below the white margin
new_img.paste(img, (0, margin_pixels))

# Save the new image
new_img.save(r'c:\Users\erina\dyad-apps\GestAudit\public\timbrado_with_margin.jpg', 'JPEG', quality=95)

print(f"Created new letterhead: {width}x{new_height} pixels")
print(f"Added {margin_pixels}px ({margin_pixels/118:.1f}cm at 300 DPI) white margin at top")
