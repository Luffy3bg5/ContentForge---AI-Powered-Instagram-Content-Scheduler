/**
 * ContentForge - Create Content Page Logic
 * Handles Form state, Live Preview, Validation, and Autosave.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // Elements - Form
    const form = document.getElementById('createContentForm');
    const inputCampaign = document.getElementById('campaignName');
    const inputTopic = document.getElementById('topic');
    const inputContext = document.getElementById('context');
    const selectTone = document.getElementById('tone');
    const inputTarget = document.getElementById('targetAudience');
    const inputNotes = document.getElementById('additionalNotes');
    const btnGenerate = document.getElementById('btnGenerateCaption');
    const btnBackStep1 = document.getElementById("btnBackStep1");
    const btnBackStep1Bottom = document.getElementById("btnBackStep1Bottom");
    
    // Elements - Tag Input
    const tagInput = document.getElementById('keywordInput');
    const tagsWrapper = document.getElementById('tagsWrapper');
    let keywords = [];

    // Elements - Preview
    const prevCampaignBadge = document.getElementById('previewCampaignBadge');
    const prevTopic = document.getElementById('previewTopic');
    const prevContext = document.getElementById('previewContext');
    const prevHashtags = document.getElementById('previewHashtags');
    const prevAudience = document.getElementById('previewAudience');
    const prevTone = document.getElementById("previewTone");
    
    // Elements - UI Indicators
    const autosaveIndicator = document.getElementById('autosaveIndicator');

    // -------------------------------------------------------------
    // 1. Tag Input Logic
    // -------------------------------------------------------------
    const renderTags = () => {
        tagsWrapper.innerHTML = '';
        keywords.forEach((keyword, index) => {
            const chip = document.createElement('div');
            chip.className = 'tag-chip';
            chip.innerHTML = `
                ${keyword}
                <span class="tag-remove" data-index="${index}">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </span>
            `;
            tagsWrapper.appendChild(chip);
        });
        updatePreviewHashtags();
    };

    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            const value = tagInput.value.trim();
            if (value && !keywords.includes(value)) {
                keywords.push(value);
                tagInput.value = '';
                renderTags();
                triggerAutosave();
            }
        }
    });

    tagsWrapper.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.tag-remove');
        if (removeBtn) {
            const index = removeBtn.getAttribute('data-index');
            keywords.splice(index, 1);
            renderTags();
            triggerAutosave();
        }
    });

    async function loadDraft() {
    
    const token = localStorage.getItem("token");
    const postId = localStorage.getItem(

        "currentPostId"

    );

    if (!postId) return;

    try {

        const response = await fetch(

            `http://localhost:5000/api/posts/${postId}`,

            {

                headers: {

                    Authorization:

                        `Bearer ${token}`

                }

            }

        );

        const data = await response.json();

        if (!data.success) return;

        const post = data.post;

        // Populate the form

        document.getElementById("campaignName").value =
            post.campaignName || "";

        document.getElementById("topic").value =
            post.topic || "";

        document.getElementById("context").value =
            post.context || "";

        document.getElementById("tone").value =
            post.tone || "";

        document.getElementById("targetAudience").value =
            post.targetAudience || "";

        keywords = post.keywords || [];
        renderTags();
        updatePreview();

        document.getElementById("additionalNotes").value =
            post.additionalNotes || "";

    } catch (error) {

        console.error(error);

    }

    }

    const updatePreviewHashtags = () => {
        if (keywords.length === 0) {
            prevHashtags.textContent = "#hashtags";
        } else {
            const hashtagString = keywords
                                        .slice(0, 5)
                                        .map(tag => `#${tag.replace(/\s+/g, "").toLowerCase()}`)
                                        .join(" ");
            prevHashtags.textContent = hashtagString;
        }
    };


    // -------------------------------------------------------------
    // 2. Live Preview & Validation Logic
    // -------------------------------------------------------------
    const validateFields = () => {
        let isValid = true;

    const checkField = (element, message) => {

    const group = element.closest(".form-group");
    const error = group.querySelector(".error-msg");
    const value = element.value.trim();

    // Empty field
    if (!value) {

        group.classList.add("has-error");
        error.textContent = message;

        isValid = false;

        return;
    }

    // Campaign Name
    if (element === inputCampaign) {

        if (value.length < 3) {

            group.classList.add("has-error");
            error.textContent =
                "Campaign name should be at least 3 characters.";

            isValid = false;
            return;
        }

        if (value.length > 60) {

            group.classList.add("has-error");
            error.textContent =
                "Campaign name cannot exceed 60 characters.";

            isValid = false;
            return;
        }

    }

    // Topic
    if (element === inputTopic) {

        if (value.length < 2) {

            group.classList.add("has-error");
            error.textContent =
                "Topic should be at least 2 characters.";

            isValid = false;
            return;
        }

        if (value.length > 40) {

            group.classList.add("has-error");
            error.textContent =
                "Topic cannot exceed 40 characters.";

            isValid = false;
            return;
        }

    }

    // Context
    if (element === inputContext) {

        if (value.length < 15) {

            group.classList.add("has-error");
            error.textContent =
                "Please provide more context for better AI results.";

            isValid = false;
            return;
        }

        if (value.length > 2200) {

            group.classList.add("has-error");
            error.textContent =
                "Instagram captions support a maximum of 2200 characters.";

            isValid = false;
            return;
        }

    }

    group.classList.remove("has-error");
    error.textContent = "";

};

        checkField(inputCampaign,"Campaign name is required.");

        checkField(inputTopic,"Topic is required.");

        checkField(inputContext,"Context is required.");

        // Toggle button state
        btnGenerate.disabled = !isValid;
        return isValid;
    };

    const updatePreview = () => {
        // Campaign Name
        const campValue = inputCampaign.value.trim();
        prevCampaignBadge.textContent =
             campValue
            ? `📢 ${campValue}`
            : "Campaign Name";
        // Topic
        const topicValue = inputTopic.value.trim();
        prevTopic.textContent =
                           topicValue
                            ? `☕ ${topicValue}`
                            : "Topic";
        // Context
        // Target Audience

        const audienceValue = inputTarget.value.trim();
        prevAudience.textContent = audienceValue || "General Audience";

        const contextValue = inputContext.value.trim();
        prevContext.textContent =
                                contextValue
                                ? contextValue
                                : "Start typing your content to see a live Instagram preview...";
        // Run validation check whenever preview updates
        prevTone.textContent = selectTone.value;
        validateFields();
    };

    // Attach listeners to all inputs for Live Preview and Autosave
    const formInputs = [inputCampaign, inputTopic, inputContext, selectTone, inputTarget, inputNotes];
    
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            updatePreview();
            triggerAutosave();
        });
    });

    selectTone.addEventListener("change", () => {

    updatePreview();

    triggerAutosave();

    });


    // -------------------------------------------------------------
    // 3. Autosave Logic (localStorage)
    // -------------------------------------------------------------
    let autosaveTimeout;

    const triggerAutosave = () => {
        clearTimeout(autosaveTimeout);
        autosaveTimeout = setTimeout(() => {
            
            const draftData = {
                campaignName: inputCampaign.value,
                topic: inputTopic.value,
                context: inputContext.value,
                tone: selectTone.value,
                targetAudience: inputTarget.value,
                notes: inputNotes.value,
                keywords: keywords,
                lastSaved: new Date().toISOString()
            };

            localStorage.setItem('contentForgeDraft', JSON.stringify(draftData));
            
            // Show Indicator
            autosaveIndicator.classList.add('visible');
            
            // Hide Indicator after 2 seconds
            setTimeout(() => {
                autosaveIndicator.classList.remove('visible');
            }, 2000);

        }, 500); // 500ms debounce
    };

    // const loadDraft = () => {
    //     const savedData = localStorage.getItem('contentForgeDraft');
        
    //     if (savedData) {
    //         try {
    //             const draft = JSON.parse(savedData);
                
    //             inputCampaign.value = draft.campaignName || '';
    //             inputTopic.value = draft.topic || '';
    //             inputContext.value = draft.context || '';
    //             selectTone.value = draft.tone || 'Professional';
    //             inputTarget.value = draft.targetAudience || '';
    //             inputNotes.value = draft.notes || '';
                
    //             if (Array.isArray(draft.keywords)) {
    //                 keywords = draft.keywords;
    //                 renderTags();
    //             }

    //             updatePreview(); // Trigger UI updates
    //             console.log("Draft restored:",draft.lastSaved || "Unknown");
                
    //         } catch (e) {
    //             console.error("Error loading draft data", e);
    //         }
    //     }
    // };


    // -------------------------------------------------------------
    // 4. Action Buttons
    // -------------------------------------------------------------
    async function generateAICaptions(postId) {

    const token = localStorage.getItem("token");

    const response = await fetch(

        `http://localhost:5000/api/ai/${postId}/generate-caption`,

        {
            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return await response.json();

   }

let generatedCaptions = [];

let generatedHashtags = [];

function renderCaptions(ai) {

    generatedCaptions = ai.captions;

    generatedHashtags = ai.hashtags;

    document.getElementById("caption1").textContent =
        ai.captions[0];

    document.getElementById("caption2").textContent =
        ai.captions[1];

    document.getElementById("caption3").textContent =
        ai.captions[2];

    document.getElementById("generatedHashtags").textContent =
        ai.hashtags.join(" ");

}

async function saveCaption(caption) {

    const token = localStorage.getItem("token");

    const postId = localStorage.getItem("currentPostId");

    const response = await fetch(

        `http://localhost:5000/api/ai/${postId}/save-caption`,

        {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({

                caption,

                hashtags: generatedHashtags

            })

        }

    );

    return await response.json();

  }
    btnGenerate.addEventListener("click", async (e) => {

    e.preventDefault();

    if (!validateFields()) return;

    const token = localStorage.getItem("token");
    if (!token) {

    alert("Please login again.");

    window.location.href = "login.html";

    return;

    }

try {
    const postData = {

    campaignName: inputCampaign.value,

    topic: inputTopic.value,

    context: inputContext.value,

    tone: selectTone.value,

    targetAudience: inputTarget.value,

    keywords: keywords,

    additionalNotes: inputNotes.value

   };
   
    const currentPostId = localStorage.getItem("currentPostId");

    let response;

    if (currentPostId) {

    response = await fetch(

        `http://localhost:5000/api/posts/${currentPostId}`,

        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(postData)

        }

    );

    } else {

    response = await fetch(

        "http://localhost:5000/api/posts",

        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(postData)

        }

      );

    }

    const data = await response.json();

    if (!currentPostId) {

    localStorage.setItem(

        "currentPostId",

        data.post._id

    );

  }

    console.log(data);

    if (!data.success) {

        alert(data.message);

        return;

    }

    localStorage.setItem(
        "currentPostId",
        data.post._id
    );

    console.log("Current Post ID:", data.post._id);

    btnGenerate.disabled = true;

    btnGenerate.innerHTML = "Generating...";

    //getting the  ai  response
    const postId = localStorage.getItem("currentPostId");

    const ai = await generateAICaptions(postId);

    if(!ai.success){

    alert("Caption generation failed.");

    return;

    }

    renderCaptions(ai);

    btnGenerate.disabled = false;

    btnGenerate.innerHTML = `
    Generate Caption
    <svg viewBox="0 0 24 24" width="20" height="20"
    fill="none" stroke="currentColor" stroke-width="2">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
    `;

    document.getElementById("step1").style.display = "none";

    document.getElementById("step2").style.display = "block";

    document
        .getElementById("progressStep1")
        .classList.remove("active");

    document
        .getElementById("progressStep2")
        .classList.add("active");

} catch (error) {

    console.error(error);

    alert("Something went wrong.");

}


});

    // Add Keyframe for spinner dynamically just in case it's not in CSS
    if (!document.getElementById('spinner-style')) {
        const style = document.createElement('style');
        style.id = 'spinner-style';
        style.textContent = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }
    
    function backToStep1(){

                document
                    .getElementById("step2")
                    .style.display="none";

                document
                    .getElementById("step1")
                    .style.display="block";

                document
                    .getElementById("progressStep2")
                    .classList.remove("active");

                document
                    .getElementById("progressStep1")
                    .classList.add("active");

            }

            btnBackStep1.addEventListener(
                "click",
                backToStep1
            );

            btnBackStep1Bottom.addEventListener(
                "click",
                backToStep1
            );


const useCaptionButtons = document.querySelectorAll(".use-caption");

    useCaptionButtons.forEach((button, index) => {
    button.addEventListener("click", async () => {

        const result = await saveCaption(
            generatedCaptions[index]
        );

        if (!result.success) {
            alert("Failed to save caption.");
            return;
        }
        alert("Caption saved successfully!");

        console.log(result.post);

        // Step 3 will be opened here later
    });

  });
    // Initialize Page
    loadDraft();
});
