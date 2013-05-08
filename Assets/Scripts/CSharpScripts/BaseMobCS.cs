using UnityEngine;
using System.Collections;

public class BaseMobCS : BaseHealthCS {

  public int level;

  public float scoreValue = 1;
  public float accelerationPower = 1;

  public float levelHPMultiplier = 15;
  public float levelShieldHPMultiplier = 0;
  public float levelScoreMultiplier = 1;
  public float levelAccelerationMultiplier = 1;

  public float aiUpdateDelay = 2; //Default delay of 2 seconds between actions.  0 means the AIUpdate function would be called each physics frame.
  public float aiUpdateDelayVariance = 0.5F; //Random part so not everything goes off at the same time...
  public float aiUpdateCountdown = 0;



	// Use this for initialization
	public virtual void Start () {
    
    base.Start();
	}
	
	// Update is called once per frame
	public override void Update () {
	}

  public virtual void FixedUpdate()
  {
    CheckLevelBounds();
    if (aiUpdateCountdown <= 0)
    {
      aiUpdateCountdown += aiUpdateDelay + Random.Range(0, aiUpdateDelayVariance);
      AIUpdate();
    }
    else
    {
      aiUpdateCountdown -= Time.deltaTime;
    }
  }

  public virtual void CheckLevelBounds()
  {
    
  }

  public virtual void AIUpdate()
  {
    Debug.Log("Base AIUpdate called!");
    Debug.Break();
  }

  public virtual void LevelUp()
  {
    SetLevel(level + 1);
  }

  public virtual void SetLevel(int NewLevel)
  {
    level = NewLevel;
    int iMult = (int)Mathf.Pow(2, level - 1);
    
    hpMax = levelHPMultiplier * iMult;
    shieldHPMax = levelShieldHPMultiplier* iMult;
    scoreValue = levelScoreMultiplier * level;
    accelerationPower = levelAccelerationMultiplier * iMult; //I'll probably want to adjust this one, that seems a bit OP...
  }

  public virtual void ResetLevel()
  {
    level = 1;
    hpMax = levelHPMultiplier;

  }

  public void OnDestroy()
  {
    MobSpawnerCS.instance.currentMobCount -= 1;
    MobSpawnerCS.instance.playerScore += (int) scoreValue;
  }
}
